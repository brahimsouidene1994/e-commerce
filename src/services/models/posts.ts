export default interface post{
  id: string;
  created_time: string | null 
  message: string | null 
}
export default interface dataPosts{
  data: post[]| null;
}