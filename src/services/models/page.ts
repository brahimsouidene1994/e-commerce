export default interface page{
  id: number;
  access_token: string;
  category: string | null;
  name: string | null
  status: boolean;
  idPage: string;
  lastRefresh: string | null
}

export default interface dataPages{
  data: page[]| null;
}
