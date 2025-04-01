import { toast } from 'react-toastify';

export function sendWarning (msg) {
    toast.warn(msg,{ autoClose:1000});
}
export function sendError (msg) {
    toast.error(msg,{ autoClose:1000});
}
export function sendSuccess(msg) {
    toast.success(msg,{ autoClose:1000});
}
