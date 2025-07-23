import discord
from discord.ext import commands
from dotenv import load_dotenv # تحميل المتغيرات من ملف .env
import os
import asyncio
import subprocess
import sys
import json
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import requests



load_dotenv() # تحميل المتغيرات من ملف .env

# تعريف token البوت
TOKEN = os.getenv('DISCORD_BOT_TOKEN')

# تشغيل البوت
async def start_bot():
    if not TOKEN:
        print("🔴 Error: DISCORD_TOKEN not found in .env file.")
        return
    else:
        print("🟢 DISCORD_TOKEN found in .env file.")
    print("🔵 Starting the bot...")

    try:
        await bot.start(TOKEN)
    except Exception as e:
        print(f"🔴 Error starting the bot: {e}")

# إعداد البوت
print("🔧 Initializing the bot...")
intents = discord.Intents.all()
intents.message_content = True
bot = commands.Bot(command_prefix='$', intents=intents)

@bot.event
async def on_ready():
    print(f'✅ Logged in as {bot.user.name}')

@bot.command()
async def ping(ctx):
    await ctx.send('🏓 Pong!')

# @bot.command()
# async def profile(ctx):
#     user = ctx.author
#     user_id = str(user.id)

#     # جِب بيانات اليوزر
#     with open('data/level.json', 'r') as f:
#         users = json.load(f)
#     if user_id not in users:
#         xp = 0
#         level = 1
#     else:
#         xp = users[user_id]['xp']
#         level = users[user_id]['level']

#     # جِب config
#     with open('./data/profile_config.json', 'r') as f:
#         config = json.load(f)

#     # افتح القالب
#     base = Image.open("images/profile_template.png").convert("RGBA")

#     # جيب صورة البروفايل بتاعة اليوزر
#     avatar_url = user.avatar.url
#     response = requests.get(avatar_url)
#     avatar = Image.open(BytesIO(response.content)).convert("RGBA")

#     # إعداد صورة البروفايل بشكل دائري ووضعها مكان الدائرة السوداء (حرف r)
#     avatar = avatar.resize((250, 250))  # غيّر الحجم حسب حجم الدائرة في القالب
#     mask = Image.new("L", avatar.size, 0)
#     draw_mask = ImageDraw.Draw(mask)
#     draw_mask.ellipse((0, 0, avatar.size[0], avatar.size[1]), fill=255)

#     # حدد مكان الدائرة السوداء (مثلاً أعلى اليسار، غيّر القيم حسب القالب)
#     avatar_left = 70  # عدلها حسب مكان الدائرة في القالب
#     avatar_top = 200   # عدلها حسب مكان الدائرة في القالب

#     base.paste(avatar, (avatar_left, avatar_top), mask)

#     # تحضير الكتابة
#     draw = ImageDraw.Draw(base)
#     try:
#         font = ImageFont.truetype("arial.ttf", 60)  # حجم الخط كبير
#     except IOError:
#         font = ImageFont.load_default()  # fallback لو الخط غير موجود

#     # اسم اليوزر
#     name_left = 360
#     name_top = 600
#     name_color = config["name"]["color"]
#     draw.text((name_left, name_top), user.name, fill=name_color, font=font)

#     # Level
#     level_left = int(float(config["level"]["left"].replace("px", "")))
#     level_top = int(float(config["level"]["top"].replace("px", "")))
#     level_color = config["level"]["color"]
#     draw.text((level_left, level_top), f"{level}", fill=level_color, font=font)

#     # Coins
#     coins_left = int(float(config["coins"]["left"].replace("px", "")))
#     coins_top = int(float(config["coins"]["top"].replace("px", "")))
#     coins_color = config["coins"]["color"]
#     # هنا انا حاطط عدد الكوينز 1 ثابت، تقدر تجيبها من ملف تاني لو عندك
#     draw.text((coins_left, coins_top), f"1", fill=coins_color, font=font)

#     # XP
#     xp_needed = (level + 1) ** 4  # XP المطلوب للمستوى التالي
#     xp_remaining = xp_needed - xp  # المتبقي للترقية
#     xp_left = int(float(config["xp"]["left"].replace("px", ""))) if "xp" in config and "left" in config["xp"] else level_left
#     xp_top = int(float(config["xp"]["top"].replace("px", ""))) if "xp" in config and "top" in config["xp"] else level_top + 60
#     xp_color = config["xp"]["color"] if "xp" in config and "color" in config["xp"] else level_color
#     draw.text((xp_left, xp_top), f"{xp}/{xp_needed}", fill=xp_color, font=font)

#     # احفظ الصورة وابعتها
#     with BytesIO() as image_binary:
#         base.save(image_binary, 'PNG')
#         image_binary.seek(0)
#         await ctx.send(file=discord.File(fp=image_binary, filename='profile.png'))

# تأكد ان الملف موجود
if not os.path.exists('./data/level.json'):
    with open('./data/level.json', 'w') as f:
        json.dump({}, f)

@bot.event
async def on_message(message):
    if message.author.bot:
        return
    user = message.author
    await add_xp(user, 5)
    await level_up(user, message.channel)
    await bot.process_commands(message)

async def get_data():
    with open('./data/level.json', 'r') as f:
        users = json.load(f)
    return users

async def add_xp(user, xp):
    users = await get_data()
    if not str(user.id) in users:
        users[str(user.id)] = {}
        users[str(user.id)]['xp'] = 0
        users[str(user.id)]['level'] = 1
    users[str(user.id)]['xp'] += xp
    with open('./data/level.json', 'w') as f:
        json.dump(users, f)

async def level_up(user, channel):
    users = await get_data()
    current_xp = users[str(user.id)]['xp']
    current_level = users[str(user.id)]['level']
    new_level = int(current_xp ** (1/4))
    if current_level < new_level:
        await channel.send(f"🎉 {user.mention} leveled up to level {new_level}!")
        users[str(user.id)]['level'] = new_level
    with open('./data/level.json', 'w') as f:
        json.dump(users, f)
# قرات commands من الفولدر commands
def scan_commands():
    print("📂 Scanning for commands...")
    if not os.path.exists('./commands'):
        print("🔴 'commands' directory not found. Please create it and add command files.")
    else:
        print("🟢 'commands' directory found.")

async def load_commands():
    print("🔍 Loading commands...")
    for filename in os.listdir('./commands'):
        if filename.endswith('.py'):
            try:
                await bot.load_extension(f'commands.{filename[:-3]}')
                print(f'🟢 Loaded Cog: {filename}')
            except Exception as e:
                print(f'🔴 Failed to load Cog "{filename}": {e}')
        else:
            print(f'🔴 Skipped non-Python file: {filename}')

# بدء البوت
async def main():
    scan_commands()
    await load_commands()
    print("✅ All Cogs loaded successfully.")
    print("🚀 Starting the bot...")
    await start_bot()

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("👋 Bot stopped by user. Goodbye!")
        sys.exit(0)
