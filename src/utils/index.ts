import { forOwn } from "lodash";

export const randomNumber = (minimum: number, maximum: number) => {
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
};

export const getImageUrl = (name: string, type = "png") => {
  return new URL(
    // 本地资源路径
    `/src/assets/${name}.${type}`,
    import.meta.url
  ).href;
};

export const transformObject2FormData = (object: Record<string, any>) => {
  const formData = new FormData()
  forOwn(object, (value, key) => {
    formData.append(key, value)
  })
  return formData
}
