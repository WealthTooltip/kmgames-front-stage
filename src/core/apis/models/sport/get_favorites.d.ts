export type TFavoritesData = {
  id: number;
  sportId: number;
  sportName: string;
  leagueId: number;
  leagueName: string;
  matchIds: string[];
  matchName?: string;
  beginTime?: string;
  createTime?: string;
}

export type TFavorites = {
  code: number;
  ts: number;
  msg: string;
  data: TFavoritesData[];
}
