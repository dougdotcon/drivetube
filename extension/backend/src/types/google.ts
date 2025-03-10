export interface GoogleUserInfo {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
}

export interface GoogleTokens {
  access_token: string
  refresh_token?: string
  scope: string
  token_type: string
  id_token: string
  expiry_date: number
} 