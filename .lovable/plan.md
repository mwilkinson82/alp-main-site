

## Add Loom Video to Ask Marshall Hero

**What**: Embed the Loom video (`d0b876b485e640cfa7e5e9b0e011c0f9`) into the hero section of the Ask Marshall page, playing muted and autoplaying so visitors get an immediate visual preview of the service.

**Implementation**:

1. **Modify `src/pages/AskMarshall.tsx`** - Update the `SalesLanding` hero section to include a Loom embed iframe below the headline and above the CTA button:
   - Use the Loom embed URL: `https://www.loom.com/embed/d0b876b485e640cfa7e5e9b0e011c0f9?autoplay=1&mute=1&hide_owner=true&hide_share=true&hide_title=true`
   - Wrap in a responsive container with rounded corners and shadow
   - Constrain to a max-width (e.g., `max-w-3xl`) so it sits nicely within the hero layout
   - Use 16:9 aspect ratio via padding-bottom technique

**Result**: Visitors land on the page and immediately see Marshall delivering a sample video response, making the value proposition tangible before they even read the copy.

