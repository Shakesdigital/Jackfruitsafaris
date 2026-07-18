# Simple PowerShell web server for the built Next.js app
# Usage: .\serve-site.ps1

$root = "E:\Jackfruit Safaris\.next\server\app"
$port = 3001

# Create listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Server running on http://localhost:$port" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow

try {
    while ($true) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # Get requested path
        $path = $request.Url.LocalPath

        if ($path -eq "/") {
            $path = "/index.html"
        }

        # Map to file system
        $fullPath = Join-Path $root $path.TrimStart('/')

        # Determine content type
        $ext = [System.IO.Path]::GetExtension($fullPath)
        switch ($ext) {
            ".html" { $response.ContentType = "text/html; charset=utf-8" }
            ".css"  { $response.ContentType = "text/css" }
            ".js"   { $response.ContentType = "application/javascript" }
            ".png"  { $response.ContentType = "image/png" }
            ".jpg"  { $response.ContentType = "image/jpeg" }
            ".svg"  { $response.ContentType = "image/svg+xml" }
            ".woff2"{ $response.ContentType = "font/woff2" }
            ".ico"  { $response.ContentType = "image/x-icon" }
            default { $response.ContentType = "text/plain" }
        }

        if (Test-Path $fullPath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($fullPath)
            $response.StatusCode = 200
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            # Try directory + index.html
            $indexPath = Join-Path $fullPath "index.html"
            if (Test-Path $indexPath -PathType Leaf) {
                $content = [System.IO.File]::ReadAllBytes($indexPath)
                $response.StatusCode = 200
                $response.ContentLength64 = $content.Length
                $response.OutputStream.Write($content, 0, $content.Length)
            } else {
                $response.StatusCode = 404
                $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 - Not Found")
                $response.ContentLength64 = $buffer.Length
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
        }

        $response.Close()
    }
} finally {
    $listener.Stop()
    Write-Host "Server stopped" -ForegroundColor Red
}