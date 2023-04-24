
export type ResultFunction = (result: string, status: number, message: string, data: any ) => void

export const result:ResultFunction = ( result: string, status: number, message: string, data: any ) =>{
    return {
        result,
        status: status,
        message,
        data: data
    }
}