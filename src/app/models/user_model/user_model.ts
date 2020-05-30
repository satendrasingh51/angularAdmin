export interface user_list {

  success: boolean,
  result: {
    data: [
      {
        _id: string,
        otp: string,
        isPublic: number,
        location: [],
        imageUrl: string,
        isVerified: number,
        status: number,
        isDeleted: number,
        userName: string,
        email: string,
        password: string,
        created: number
      }
    ],
    globalCount: number,
    count: number
  },
  message: string,
  status: number,
  time: number

}