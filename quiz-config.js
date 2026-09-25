// Production requires a verified private lead-storage endpoint.
// Do not replace failed capture with a local result or an email draft.
window.MCPScanQuizConfig = {
 endpoint: ['127.0.0.1','localhost'].includes(location.hostname) ? '/api/quiz' : 'https://qdnaglhailuflynirqtt.supabase.co/functions/v1/mcpscan-quiz',
 headers: ['127.0.0.1','localhost'].includes(location.hostname) ? {} : {
  apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkbmFnbGhhaWx1Zmx5bmlycXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwOTc0MjIsImV4cCI6MjA5MDY3MzQyMn0.-d_IxHBAEXa_DoahB7pqzNp7hEWyh5lNXa7gVxYMvCU',
  Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkbmFnbGhhaWx1Zmx5bmlycXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwOTc0MjIsImV4cCI6MjA5MDY3MzQyMn0.-d_IxHBAEXa_DoahB7pqzNp7hEWyh5lNXa7gVxYMvCU'
 }
};
