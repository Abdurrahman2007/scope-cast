CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  display_name text,
  balance integer NOT NULL DEFAULT 10000 CHECK (balance >= 0),
  last_check_in date,
  streak integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE TABLE public.predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  market_id text NOT NULL,
  market_title text NOT NULL,
  outcome_id text NOT NULL,
  outcome_label text NOT NULL,
  amount integer NOT NULL CHECK (amount >= 10),
  probability integer NOT NULL,
  potential_return integer NOT NULL,
  status text NOT NULL DEFAULT 'active',
  payout integer,
  idempotency_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  UNIQUE (user_id, idempotency_key)
);
CREATE INDEX predictions_user_idx ON public.predictions (user_id, created_at DESC);
CREATE INDEX predictions_market_idx ON public.predictions (market_id);
GRANT SELECT ON public.predictions TO authenticated;
GRANT ALL ON public.predictions TO service_role;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own predictions" ON public.predictions FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.points_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount integer NOT NULL,
  kind text NOT NULL,
  reference_id uuid,
  balance_after integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX points_tx_user_idx ON public.points_transactions (user_id, created_at DESC);
GRANT SELECT ON public.points_transactions TO authenticated;
GRANT ALL ON public.points_transactions TO service_role;
ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own points" ON public.points_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.points_transactions (user_id, amount, kind, balance_after) VALUES (NEW.id, 10000, 'signup_bonus', 10000);
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Called only by the server after it verified the market and odds.
CREATE OR REPLACE FUNCTION public.place_prediction(
  _user_id uuid, _market_id text, _market_title text, _outcome_id text, _outcome_label text,
  _amount integer, _probability integer, _idempotency_key text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _balance integer; _pred_id uuid; _existing public.predictions; _return integer;
BEGIN
  IF _amount IS NULL OR _amount < 10 OR _amount > 1000000 THEN RETURN jsonb_build_object('ok', false, 'message', 'Enter at least 10 TAC.'); END IF;
  SELECT * INTO _existing FROM public.predictions WHERE user_id = _user_id AND idempotency_key = _idempotency_key;
  IF FOUND THEN
    SELECT balance INTO _balance FROM public.profiles WHERE id = _user_id;
    RETURN jsonb_build_object('ok', true, 'id', _existing.id, 'balance', _balance, 'duplicate', true);
  END IF;
  SELECT balance INTO _balance FROM public.profiles WHERE id = _user_id FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('ok', false, 'message', 'Account not found.'); END IF;
  IF _balance < _amount THEN RETURN jsonb_build_object('ok', false, 'message', 'You do not have enough TAC Points.'); END IF;
  _return := round(_amount * 100.0 / GREATEST(1, _probability));
  UPDATE public.profiles SET balance = balance - _amount, updated_at = now() WHERE id = _user_id;
  INSERT INTO public.predictions (user_id, market_id, market_title, outcome_id, outcome_label, amount, probability, potential_return, idempotency_key)
  VALUES (_user_id, _market_id, _market_title, _outcome_id, _outcome_label, _amount, _probability, _return, _idempotency_key)
  RETURNING id INTO _pred_id;
  INSERT INTO public.points_transactions (user_id, amount, kind, reference_id, balance_after)
  VALUES (_user_id, -_amount, 'prediction', _pred_id, _balance - _amount);
  RETURN jsonb_build_object('ok', true, 'id', _pred_id, 'balance', _balance - _amount);
END $$;
REVOKE EXECUTE ON FUNCTION public.place_prediction(uuid,text,text,text,text,integer,integer,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.place_prediction(uuid,text,text,text,text,integer,integer,text) TO service_role;

CREATE OR REPLACE FUNCTION public.claim_daily_reward()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _uid uuid := auth.uid(); _p public.profiles; _today date := (now() AT TIME ZONE 'utc')::date; _streak integer; _reward integer;
BEGIN
  IF _uid IS NULL THEN RETURN jsonb_build_object('ok', false, 'message', 'Sign in first.'); END IF;
  SELECT * INTO _p FROM public.profiles WHERE id = _uid FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('ok', false, 'message', 'Account not found.'); END IF;
  IF _p.last_check_in = _today THEN RETURN jsonb_build_object('ok', false, 'message', 'Already claimed today.'); END IF;
  _streak := CASE WHEN _p.last_check_in = _today - 1 THEN _p.streak + 1 ELSE 1 END;
  _reward := 100 + LEAST(_streak - 1, 6) * 10;
  UPDATE public.profiles SET balance = balance + _reward, last_check_in = _today, streak = _streak, updated_at = now() WHERE id = _uid;
  INSERT INTO public.points_transactions (user_id, amount, kind, balance_after) VALUES (_uid, _reward, 'daily_check_in', _p.balance + _reward);
  RETURN jsonb_build_object('ok', true, 'reward', _reward, 'streak', _streak, 'balance', _p.balance + _reward);
END $$;
REVOKE EXECUTE ON FUNCTION public.claim_daily_reward() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_daily_reward() TO authenticated;
