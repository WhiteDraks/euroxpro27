# Custom domain (why and how)

Some internet providers block or misroute every `*.vercel.app` address, because
that shared domain also hosts phishing sites. A visitor on such a network cannot
open the site or the delegate app at all. A domain of our own fixes this for
everyone.

## 1. Add the domains in Vercel

- Website project (`euroxpro27`): Settings → Domains → add `euroxpro27.com` and
  `www.euroxpro27.com` (Vercel offers to redirect one to the other).
- Delegate app project (`app-mobile`): Settings → Domains → add
  `app.euroxpro27.com`.

## 2. DNS records at the domain registrar

| Type  | Name  | Value                  |
|-------|-------|------------------------|
| A     | @     | 76.76.21.21            |
| CNAME | www   | cname.vercel-dns.com   |
| CNAME | app   | cname.vercel-dns.com   |

Vercel shows the exact values on the Domains page; use those if they differ.
If the domain is bought through Vercel, no DNS step is needed.

## 3. Point the code at the new addresses

- Website project → Settings → Environment Variables:
  - `SITE_URL` = `https://euroxpro27.com` (share previews, sitemap, canonical URLs)
  - `DELEGATE_APP_URL` = `https://app.euroxpro27.com` (Approvals League data)
  then redeploy.
- GitHub repo → Settings → Secrets and variables → Actions → Variables:
  `APP_URL` = `https://app.euroxpro27.com` (push reminder cron).

The delegate app itself needs no change: its API, CSP, origin check and push
setup all use the host the request arrived on. Logged-in users sign in once
again on the new address, since cookies belong to a domain. The old
`*.vercel.app` addresses keep working for anyone whose network allows them.
