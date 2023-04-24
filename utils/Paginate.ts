
export function Paginate(query: { page: any; limit: any }, data: []) {
    const page = query.page ? parseInt(query.page) : 1
    const limit = query.limit ? parseInt(query.limit) : 20

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const paginatedResult:any = {}

    if(endIndex < data.length ){
        paginatedResult.next = {
            page: page + 1,
            limit: limit
        }
    }

    if(startIndex > 0){
        paginatedResult.previous = {
            page: page - 1,
            limit: limit
        }
    }

    paginatedResult.results = data.slice(startIndex, endIndex)
    //paginatedResult.results.reverse()
    return paginatedResult
}