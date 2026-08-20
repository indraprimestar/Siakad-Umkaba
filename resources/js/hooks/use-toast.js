// resources/js/hooks/use-toast.js
//import { toast } from "sonner";

//export const useToast = () => {
//  return {
//    toast: {
//      success: (msg, opts) => toast.success(msg, opts),
//      error: (msg, opts) => toast.error(msg, opts),
//      info: (msg, opts) => toast.message(msg, opts),
//      show: (msg, opts) => toast.message(msg, opts), // alias umum
//    },
//  };
//};`

import { toast } from 'sonner';
export const useToast = () => ({
    toast: {
        success: (m, o) => toast.success(m, o),
        error: (m, o) => toast.error(m, o),
        info: (m, o) => toast.message(m, o),
        show: (m, o) => toast.message(m, o),
    },
});
