import os
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
import google.generativeai as genai

# Configure your Gemini API key securely from environment variables
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

def index_view(request):
    return render(request, 'ai_assistant/index.html')

@csrf_exempt
def api_chat(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_prompt = data.get('prompt', '')

            if not user_prompt:
                return JsonResponse({'error': 'Prompt cannot be empty'}, status=400)

            # Using Gemini 2.5/3.5 Flash model
            model = genai.GenerativeModel('gemini-2.5-flash') # or 'gemini-1.5-flash' depending on available tier
            response = model.generate_content(user_prompt)

            return JsonResponse({'response': response.text})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
            
    return JsonResponse({'error': 'Invalid method'}, status=405)