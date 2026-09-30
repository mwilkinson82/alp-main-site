/** Remove contact metadata only from the document preamble; preserve teaching structure. */
export function cleanReplayHtml(raw: string): string {
  let body = raw.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? raw;
  body = body.replace(/\s(?:class|id|style)="[^"]*"/gi, '').replace(/<span>([\s\S]*?)<\/span>/gi, '$1');
  const boundary = /<h[1-6][^>]*>\s*(?:Summary|Details|Transcript|[^<]* - Transcript)\s*<\/h[1-6]>/i.exec(body);
  const end = boundary?.index ?? body.length;
  let preamble = body.slice(0, end);
  const hasContactHeader = /(?:^|>)\s*(?:Invited|Participants?|Attendees?|Contacts?|Guests?)\b/i.test(preamble);
  // Contact blocks can be paragraphs or tables. Never remove teaching tables wholesale.
  preamble = preamble.replace(/<(p|table|ul|ol)\b[^>]*>[\s\S]*?<\/\1>/gi, block => {
    const text = block.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').trim();
    return /^(?:Invited|Participants?|Attendees?|Contacts?|Guests?)\b/i.test(text) ? '' : block;
  });
  // Preamble-only email redaction covers unlabeled continuation rows; body emails are teaching content.
  if (hasContactHeader) {
    preamble = preamble.replace(/<a\b[^>]*href=["']mailto:[^"']*["'][^>]*>[\s\S]*?<\/a>/gi, '')
      .replace(/[A-Z0-9._%+-]+(?:@|&#64;|&#x40;)[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[contact removed]');
  }
  body = preamble + body.slice(end);
  return body.replace(/<p>\s*(?:&nbsp;|\s)*<\/p>/gi, '').trim();
}
