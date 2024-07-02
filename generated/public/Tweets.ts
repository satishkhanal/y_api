// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type UsersId } from './Users';
import { type default as Visibility } from './Visibility';

/** Identifier type for public.tweets */
export type TweetsId = string & { __brand: 'TweetsId' };

/** Represents the table public.tweets */
export default interface Tweets {
  id: TweetsId;

  content: string;

  media_url: string[] | null;

  created_at: Date;

  updated_at: Date;

  edited: boolean | null;

  user_id: UsersId;

  like_count: string;

  visibility: Visibility;

  retweet_count: string;

  comment_count: string;

  view_count: string;
}

/** Represents the initializer for the table public.tweets */
export interface TweetsInitializer {
  id: TweetsId;

  content: string;

  media_url?: string[] | null;

  /** Default value: CURRENT_TIMESTAMP */
  created_at?: Date;

  /** Default value: CURRENT_TIMESTAMP */
  updated_at?: Date;

  /** Default value: false */
  edited?: boolean | null;

  user_id: UsersId;

  /** Default value: 0 */
  like_count?: string;

  /** Default value: 'public'::visibility */
  visibility?: Visibility;

  /** Default value: 0 */
  retweet_count?: string;

  /** Default value: 0 */
  comment_count?: string;

  /** Default value: 0 */
  view_count?: string;
}

/** Represents the mutator for the table public.tweets */
export interface TweetsMutator {
  id?: TweetsId;

  content?: string;

  media_url?: string[] | null;

  created_at?: Date;

  updated_at?: Date;

  edited?: boolean | null;

  user_id?: UsersId;

  like_count?: string;

  visibility?: Visibility;

  retweet_count?: string;

  comment_count?: string;

  view_count?: string;
}
