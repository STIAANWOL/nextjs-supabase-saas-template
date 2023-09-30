# nextjs-supabase-saas-template

A SaaS template built with NextJS and Supabase.

The template is built using NextJS and Supabase.
It includes:

- Sign up page
- Sign in page
- Forgot password page
- Change password as authenticated user
- Delete account as authenticated user
- Google Auth integration

I have also left a OpenAI client and a ReactQueryProvider in the template for easy use.

Tech Stack:

- NextJS
- Supabase
- TailwindCSS
- Shadcn/ui
- ReactQuery
- Zod
- TypeScript

## Setup:

### Initial Setup:

Clone the repo and run npm install.

### Supabase Setup:

- Go to Supabase and create a new project. You will need to create a new organization if you don't already have one.
- Enter a name for the project and create a password for the DB. For what we will do this will not be needed but its good to keep if you want to access the database directly.
  (You can reset your DB password if you go to Settings -> Database -> Database Password)

- You will then be presented with the project API keys. Copy the public key the service_role key and also the project url.
  (You can access these also if you are on Settings -> API)

- Create a .env.local file in your project and paste the following into it:

```
NEXT_PUBLIC_SUPABASE_URL='your_public_supabase_url'
NEXT_PUBLIC_SUPABASE_ANON_KEY='your_supabase_anon_key'
NEXT_SERVICE_ROLE_KEY='your_supabase_service_role_key'
```

(The service_role_key grants 'admin rights' and is needed to delete a user account in the /dashboard/user route of the template.)

- Next go to Database -> Tables -> Create Table. Call it users. Disable RLS for now.
- Change the id column to the type uuid and remove the default value so that it's null. Also click the foreign key link button and set it to link to the auth schema, users table, id column.
- Add a column email and make the type text. Remove the nullable flag on the settings cog button.
- Save and add the table.

At this point you should be able to use the /sign-up route and enter your email address and password and then create an account. You should receive an email when clicking on the sign-up link and should be redirected to the http://localhost:3000/dashboard route.

Tip:

You can test multiple accounts as follows. If your email address is yourlegitemail@gmail.com.
You can make test accounts like yourlegitemail+1@gmail.com and it will still be received in your yourlegitemail@gmail.com inbox.

Note:

If you stopped receiving emails. Supabase has a STMP client built in for us to use but its limited to only 4 emails per hour. This is meant for testing and not for production use. This is why I recommend integrating with Resend for production projects.

### Google Auth Setup:

- Go to [Google Cloud Resource Manager](https://console.cloud.google.com/cloud-resource-manager) and click create project.
- Enter a name and create your project. Then in the navigation bar go to Api and Services.
- Click Create Credentials and choose OAuth Client ID.

If you are prompted to configure a consent screen do the following:
Configure a consent screen if needed and choose external users. Enter only the mandatory fields (name and your email address).
Next go to Create Credentials again.

- Choose web application.
  In Authorized Javascript Origins add http://localhost:3000 (you will change this to your domain name if you go to production)
  In the Authorized redirect URL’s add your_public_supabase_url/auth/v1/callback.
  You will then see your Client ID and Client Secret after you click Create.
- Go to Supabase -> Authorization -> Providers. Enter the Client ID and the Client secret and save.
  Once you've done this you will be able to go to /sign-up or /sign-in route and click on Continue with Google. Both will work and you should see a user table row in your Supabase user table by going to Supabase -> Table Editor -> users.

Additional Supabase User Auth:

The following rpc functions are used by the template and will need to be added to your Supabase project.

To enable change of password in /dashboard/account go to Supabase -> SQL Editor and make a new query. Paste and run:

```
create or replace function change_user_password(current_password varchar, new_password varchar)
returns json
language plpgsql
security definer
as $$
DECLARE
_uid uuid;
user_id uuid;
BEGIN
  user_id := auth.uid();
  SELECT id INTO _uid
  FROM auth.users
  WHERE id = user_id
  AND encrypted_password =
  crypt(current_password::text, auth.users.encrypted_password);

  IF NOT FOUND THEN
	RAISE EXCEPTION 'Current password is incorrect!';
  END IF;

  UPDATE auth.users SET
  encrypted_password =
  crypt(new_password, gen_salt('bf'))
  WHERE id = user_id;

  RETURN '{"message": "Password changed!"}';
END;
$$
```

To check if a user has set a password all ready add the following rpc function by pasting and running:

```
CREATE OR REPLACE FUNCTION has_user_set_password()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _uid UUID;
  user_id UUID;
BEGIN
  user_id := auth.uid();
  SELECT id INTO _uid
  FROM auth.users
  WHERE id = user_id
  AND encrypted_password =
	crypt(''::TEXT, COALESCE(auth.users.encrypted_password, ''));

  IF NOT FOUND THEN
	RETURN TRUE; -- User has a password
  ELSE
	RETURN FALSE; -- User does not have a password
  END IF;
EXCEPTION
  WHEN others THEN
	RETURN FALSE; -- Error occurred, treat as user not having a password
END;
$$;
```

This is used in the /dashboard/account route and is needed to differentiate between OAuth users and users that signed up by entering their email address and password. The template changes the UI in the /dashboard/account route based on this check.

You can see these functions that you made in Supabase -> Database -> Functions.

### OpenAI Setup:

Since we are in the era of AI, I have left an OpenAI client setup in the template, located at app/utils/chatgpt.ts.

- You can setup OpenAI by going to [OpenAI API Keys](https://platform.openai.com/account/api-keys). Choose Create a new secret key.
- Then add OPENAI_API_KEY=your_openai_api_key to your .env.local file.

### Additional:

I have also implemented ReactQuery and have wrapped the app in a ReactQueryProvider for you ready to be used.

For those wanting to deploy with Vercel, I have implemented Vercel Analytics also. You can see the implementation in app/layout.tsx.

Enjoy and happy coding.
