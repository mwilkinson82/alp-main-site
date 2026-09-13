# Domain report and fix for www.altitudelogicpressure.com

## What the Domains panel shows

Project is published.

| Domain | Status |
| --- | --- |
| altitudelogicpressure.com | Active / Live — serving this project |
| www.altitudelogicpressure.com | Drifted ("Offline" in the panel) for the last ~44 minutes — DNS no longer points here |

## Exact records Lovable expects

Apex (altitudelogicpressure.com) — already correct, nothing to change:

```text
A    @    185.158.133.1
```

www (currently wrong):

```text
A    www                185.158.133.1
TXT  _lovable.www       lovable_verify=b5c1cab77ada1ce272b17c3eed76fcba8798f7cbc126cba5a34b5c186fb3e9c9
```

Verification TXT for www is present and correct. Only the A record is off.

## Warnings found

- The www A record currently answers with four addresses: 198.185.159.144, 198.185.159.145, 198.49.23.144, 198.49.23.145. Those are Squarespace hosting addresses, so www is still being served by an old Squarespace setup.
- No AAAA record conflict and no Cloudflare proxy issue was detected.
- Nothing else about the apex is conflicting.

## Recommended fix

1. At the DNS provider for altitudelogicpressure.com, delete all four Squarespace A records on the `www` host.
2. Add one A record: host `www`, value `185.158.133.1`.
3. Leave the `_lovable.www` TXT record exactly as it is.
4. Wait for propagation (usually minutes, up to 72 hours) — the status moves from Offline to Active on its own.

If you would rather have www redirect instead of serve, keeping the apex as the primary domain does that automatically once www is connected.

## Notes

No code or DNS was changed for this report. If you approve, the next step is opening the domain connect card so the www records can be fixed from chat, either automatically through the registrar or with the exact values to copy.
