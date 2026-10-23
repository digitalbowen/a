#!/bin/bash
# ============================================================
# 双击此文件即可启动网站并在浏览器中打开（支持 Supabase 同步）
# Double-click this file to start the local server and open the site.
# ============================================================

cd "$(dirname "$0")/personal-website" || exit 1

PORT=8765
URL="http://localhost:${PORT}/projects.html"

# 1) 如果服务器还没运行，就启动它
if ! curl -s -o /dev/null --max-time 2 "http://localhost:${PORT}/projects.html"; then
  nohup /usr/bin/ruby -run -e httpd . -p ${PORT} --bind-address=127.0.0.1 \
    > /tmp/steam-website-server.log 2>&1 &
  # 等待服务器就绪（最多约 5 秒）
  for i in 1 2 3 4 5 6 7 8 9 10; do
    if curl -s -o /dev/null --max-time 1 "http://localhost:${PORT}/projects.html"; then
      break
    fi
    sleep 0.5
  done
fi

# 2) 打开浏览器
open "${URL}"

# 3) 保持窗口几秒，方便看到提示信息
echo "网站已启动：${URL}"
echo "请在浏览器中使用这个地址。这个窗口可以直接关闭，不影响网站运行。"
sleep 3
