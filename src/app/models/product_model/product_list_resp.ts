export interface Pr_list_resp{
    
        success: boolean,
        result: {
          data: [
            {
              _id:string,
              name: string,
              brand: string,
              direction: string,
              description: string,
              media: string,
              created: number,
              categoryData: [
                {
                  _id: string,
                  category: string,
                  isDeleted: number,
                  created: number,
                  updated: number
                }
              ],
              subCategoryData: []
            }
          ],
          globalCount: number,
          count: number
        },
        message: string,
        status: number,
        time:number
      
}
export interface data{
    
}

