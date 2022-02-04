import { ProfileType } from './profile.type'

export interface ProfileResponseInterface {
  profile: Omit<ProfileType, 'articles' | 'favorites' | 'email' | 'followers'>
}
