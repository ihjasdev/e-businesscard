# Welford Systems — Digital Business Card

A static, mobile-friendly collection of digital business cards for the Welford Systems team.

## Included

- Welford-style business card layout based on the supplied printed card
- Responsive mobile / desktop design
- Click-to-call
- Click-to-email
- Website link
- Native Share button where supported
- `Save Contact` button using a standard `.vcf` vCard
- QR codes linking to the profiles at `https://profile.isitsolution.com`
- Independent profile pages and QR codes for Sabrin Naleer and Ihjas Abdullah
- Optional circular profile photo at the top-right of the card
- Contact details and generated vCards driven by `profile-data.json`
- No database, backend, or paid hosting required

## Files

```text
index.html
style.css
script.js
sabrin-naleer.vcf
profile-data.json
assets/
  welford-logo.svg
  qr-sabrin.png
  qr-ihjas.png
  ihjas-abdullah.png
```

## Test locally

Because the profiles are loaded from JSON, run a tiny local web server:

```bash
python3 -m http.server 8080
```

Then visit:

```text
http://localhost:8080
```

## Deploy to Vercel

1. Create a Vercel account.
2. Create a new project and upload/import this folder.
3. Deploy it.
4. In Vercel, add your custom domain:
   `profile.isitsolution.com`
5. Vercel will show the exact DNS record you must create.

## Connect the Spaceship domain

In Spaceship:

1. Open your domain.
2. Go to **Advanced DNS**.
3. Add the DNS record provided by Vercel.
4. Usually this is a CNAME for the host `card`, but always use the exact value shown by Vercel.
5. Wait for DNS verification and HTTPS activation.

## Recommended URL

This package is configured so the public card URL can be:

```text
https://profile.isitsolution.com/sabrin
```

The included `vercel.json` rewrites `/sabrin` to the card page.
It also rewrites `/ihjas` directly to Ihjas Abdullah's profile.

If you use different URLs, regenerate the matching `assets/qr-sabrin.png` or `assets/qr-ihjas.png` file.

## Change contact information

Edit the matching entry in `profile-data.json`. Empty phone or email fields are hidden automatically, and the Save Contact button builds the correct vCard in the browser.

Ihjas Abdullah's title, phone number, and email are intentionally empty until the real details are supplied.

## Important

Keep the QR code pointed at the web page, not directly at the `.vcf` file. This lets you change contact details later without replacing the printed QR code.
