# Contact forms

The black navigation strip appears on the catalog, all mod detail pages, the contact page and the thank-you page. Discord was explicitly removed from the requested scope.

Contact Us offers four paths:

- Volunteer to be a TPG Mod Tester
- Report a Bug
- New Mod Request
- Existing Mod Feature Requests

Each path has its own short questions, a message field, optional attachment and required reply email. Available-mod lists are generated from confirmed public inventory only. Switching paths preserves entered fields. Native HTML validation works without a JavaScript submission handler; JavaScript shows one form at a time and checks attachment size/type.

## Delivery

Justin selected **Thepropergrip@gmail.com** and confirmed the website uses only its pages.dev address. Forms submit directly to FormSubmit over HTTPS using multipart encoding. No Cloudflare upgrade, custom domain or new Cloudflare credential scopes are required. The email subject identifies the request type, and the visitor's email supplies Reply-To. No automated reply or marketing signup is configured.

The recipient must activate delivery using the verification email sent by FormSubmit. Justin confirmed activation on October 23, 2026. A controlled multipart submission then returned the expected 302 redirect to the thank-you page. Justin confirmed that the email **TPG Mods - Contact form delivery test** arrived with **tpg-contact-test.txt** attached. Inbox and attachment delivery are verified. The controlled setup test disabled CAPTCHA only for that request; published forms retain the provider's default CAPTCHA. FormSubmit can supply an opaque action identifier after activation; replace `contactDestination` in `scripts/contact.mjs` with that identifier when available.

Live forms retain FormSubmit's default CAPTCHA plus a honeypot. After the provider accepts a submission, it redirects to `https://tpg-mods.pages.dev/contact/thanks/`. Do not claim success locally before the provider handles the request. File attachments are optional, limited to 10 MB, and accept screenshots, PDF, text/log files, DCS missions/tracks and ZIPs. Larger evidence can be linked in the message. Attachments are delivered by email, not hosted publicly.

The provider documents a 30-day text-submission archive; attachments are not retained in that archive.

## Maintenance

- Form questions and attachment rules: `site/assets/contact-options.js`
- Navigation and generated form HTML: `scripts/contact.mjs`
- Selection and client validation: `site/assets/contact.js`
- Dropdown dismissal: `site/assets/navigation.js`
- Build integration: `scripts/build.mjs`
- Validation: `npm test` and `npm run build`

Official references checked October 23, 2026:

- https://formsubmit.co/documentation
- https://formsubmit.co/help
- https://developers.cloudflare.com/email-service/get-started/send-emails/

Cloudflare's native email sender requires an onboarded custom domain, so it is not used for this pages.dev-only setup.
