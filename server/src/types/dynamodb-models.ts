/**
 * ThankfulWallPost DynamoDB Model
 * @primaryKey post_type
 * @sortKey created_date
 */
export interface ThankfulWallPost {
  /** Example: "Today..." */
  text: string;
  /** Example: ["127.0.0.1", "::1"] */
  likes: any[];
  /** Example: "PUBLIC" | @primaryKey */
  post_type: string;
  /** Example: "5e40c44a38f97a4b5cbff284" */
  id: string;
  /** Example: "Sol Lim" */
  name: string;
  /** Example: "2020-02-10T02:47:38.908Z" | @sortKey */
  created_date: string;
}
