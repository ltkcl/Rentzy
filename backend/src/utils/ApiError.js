class ApiError extends Error{
    constructor(
        statusCode,
        message,
        error=[],
        statch=""
    ){
        super(message)
        this.statusCode = statusCode
        this.error = error
        this.statch = statch
        this.success = false;
        this.data = null;
        this.message = message;
        if(this.stack){
            this.stack = this.stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
 
export default ApiError;