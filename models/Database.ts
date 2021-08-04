/*
* This file was generated by a tool.
* Rerun sql-ts to regenerate this file.
*/
export interface DeviceLog {
  "id"?: string 
  "userid"?: string | null 
  "deviceid"?: string | null 
  "isvirtual"?: boolean | null 
  "manufacturer"?: string | null 
  "model"?: string | null 
  "operatingsystem"?: string | null 
  "osversion"?: string | null 
  "platform"?: string | null 
  "useragent"?: string | null 
  "networkaddress"?: string | null 
  "webviewversion"?: string | null 
  "xtra"?: any | null 
  "created_at"?: Date | null 
}
export interface GameData {
  "id"?: string 
  "user_id": string 
  "person_id": string 
  "help_category"?: number 
  "help_famous_as"?: number 
  "help_birthdate"?: number 
  "help_birthplace"?: number 
  "help_notes"?: number 
  "help_photo"?: number 
  "score"?: number 
  "created_at"?: Date | null 
}
export interface People {
  "id"?: string 
  "name"?: string | null 
  "category"?: string | null 
  "famous_as"?: string | null 
  "birthdate"?: string | null 
  "birthplace"?: string | null 
  "died"?: string | null 
  "notes"?: string | null 
  "photo_info"?: any | null 
  "alt_name"?: string | null 
}
export interface People2 {
  "id"?: string | null 
  "name"?: string | null 
  "years"?: string | null 
  "description"?: string | null 
  "alive"?: boolean | null 
}
export interface SupascriptJsModules {
  "module": string 
  "autoload"?: boolean | null 
  "source"?: string | null 
}
export interface SupascriptLog {
  "id"?: string 
  "created"?: Date | null 
  "_catalog"?: string | null 
  "_user"?: string | null 
  "_schema"?: string | null 
  "_schemas"?: any | null 
  "_pid"?: number | null 
  "log_type"?: string | null 
  "query"?: string | null 
  "content"?: any | null 
}
