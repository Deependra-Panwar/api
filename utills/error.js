export const createError = (status, message)=>{
    const errorObj ={
        status:status,
        message:message,
    }
    return errorObj;
}