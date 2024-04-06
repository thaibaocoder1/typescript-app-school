export type ResponseFromServer<T = any> = {
  status: string;
  message: string;
  data?: T;
};
