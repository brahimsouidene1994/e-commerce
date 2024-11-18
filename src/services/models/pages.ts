export default interface page{
  id: string;
  access_token: string | null 
  category: string | null 
  name: string | null
  tasks: string[] | null
}
export default interface dataPages{
  data: page[]| null;
}