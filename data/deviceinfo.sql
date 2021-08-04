CREATE TABLE IF NOT EXISTS device_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userid UUID NULL,
    deviceid UUID,
    isvirtual BOOLEAN,
    manufacturer TEXT,
    model TEXT,
    operatingsystem TEXT,
    osversion TEXT,
    platform TEXT,
    useragent TEXT,
    networkaddress TEXT,
    webviewversion TEXT,
    xtra JSONB NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE device_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public can insert device_log records" ON public.device_log FOR INSERT WITH CHECK (true);

CREATE OR replace FUNCTION log_device(userid TEXT, deviceid TEXT, isvirtual BOOLEAN, manufacturer TEXT, 
                        model TEXT, operatingsystem TEXT, osversion TEXT, platform TEXT, webviewversion TEXT, useragent TEXT)
   RETURNS void 
   LANGUAGE sql
  as
$$
  INSERT INTO device_log
  (
    networkaddress, userid, deviceid, isvirtual, manufacturer, model, operatingsystem, osversion, platform, webviewversion, useragent
  ) 
  values 
  (
    current_setting('request.header.x-forwarded-for', true),
    userid::UUID, deviceid::UUID, isvirtual, manufacturer, model, operatingsystem, osversion, platform, webviewversion, useragent
  );
$$

