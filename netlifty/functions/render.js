export default async (req) => {
  try {
    if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
    const { zpl, dpmm='8dpmm', width='4', height='6', index=0, format='png' } = await req.json();
    if (!zpl || typeof zpl !== 'string') return new Response('Missing zpl', { status: 400 });
    const accept = format === 'pdf' ? 'application/pdf' : 'image/png';
    const url = `http://api.labelary.com/v1/printers/${dpmm}/labels/${width}x${height}/${index}/`;
    const resp = await fetch(url, { method:'POST', headers:{ Accept:accept, 'Content-Type':'application/x-www-form-urlencoded' }, body:zpl });
    const buf = await resp.arrayBuffer();
    if (!resp.ok) return new Response(new TextDecoder().decode(buf), { status: resp.status });
    return new Response(buf, { status: 200, headers: { 'Content-Type': accept } });
  } catch (e) {
    return new Response(`Render error: ${e.message}`, { status: 500 });
  }
}
