import * as axios from 'axios'
import type { AxiosRequestConfig } from "axios";

declare module 'axios' {
  interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<any>
  }
}
