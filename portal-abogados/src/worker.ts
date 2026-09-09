export interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.hostname === "www.jurisconecta.cl") {
      url.hostname = "jurisconecta.cl";
      return Response.redirect(url.toString(), 308);
    }

    if (url.pathname === "/api/health") {
      return Response.json({ status: "ok", service: "jurisconecta" });
    }

    return env.ASSETS.fetch(request);
  },
};

export default worker;
