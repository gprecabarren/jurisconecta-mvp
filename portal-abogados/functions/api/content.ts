import { defaultHelp, defaultTeam, type HelpArticle, type TeamMember } from "../_lib/content";

interface D1Statement { bind(...values: unknown[]): D1Statement; all<T>(): Promise<{ results: T[] }>; }
interface D1Database { prepare(query: string): D1Statement; }
interface Context { env: { DB?: D1Database }; }

export const onRequestGet = async ({ env }: Context) => {
  if (!env.DB) return Response.json({ team: defaultTeam, help: defaultHelp });
  try {
    const [team, help] = await Promise.all([
      env.DB.prepare("SELECT id, name, role, bio, initials FROM team_members ORDER BY sort_order, name").all<TeamMember>(),
      env.DB.prepare("SELECT id, title, category, excerpt FROM help_articles ORDER BY sort_order, title").all<HelpArticle>(),
    ]);
    return Response.json({ team: team.results, help: help.results });
  } catch { return Response.json({ team: defaultTeam, help: defaultHelp }); }
};
