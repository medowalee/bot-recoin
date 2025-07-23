from discord.ext import commands
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import requests
import json
import os
import discord

COINS_FILE = 'data/coins.json'

def get_coins_data():
    if not os.path.exists(COINS_FILE):
        with open(COINS_FILE, 'w') as f:
            json.dump({}, f)
    with open(COINS_FILE, 'r') as f:
        return json.load(f)

def save_coins_data(data):
    with open(COINS_FILE, 'w') as f:
        json.dump(data, f)

def get_user_coins(user_id):
    data = get_coins_data()
    return data.get(str(user_id), 0)

def set_user_coins(user_id, amount):
    data = get_coins_data()
    data[str(user_id)] = amount
    save_coins_data(data)

def add_user_coins(user_id, amount):
    coins = get_user_coins(user_id)
    set_user_coins(user_id, coins + amount)

def remove_user_coins(user_id, amount):
    coins = get_user_coins(user_id)
    set_user_coins(user_id, max(0, coins - amount))

class Public(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(aliases=["r"])
    async def profile(self, ctx, target=None):
        """عرض بطاقة البروفايل. يمكنك استخدام منشن أو آيدي المستخدم."""
        user = ctx.author
        if target:
            # إذا كان منشن
            if hasattr(target, "mention"):
                user = target
            else:
                try:
                    user = await ctx.bot.fetch_user(int(target))
                except Exception:
                    await ctx.send("❌ لم أجد مستخدم بهذا الآيدي.")
                    return
        user_id_str = str(user.id)

        # جِب بيانات اليوزر
        with open('data/level.json', 'r') as f:
            users = json.load(f)
        if user_id_str not in users:
            xp = 0
            level = 1
        else:
            xp = users[user_id_str]['xp']
            level = users[user_id_str]['level']

        # جِب config
        with open('./data/profile_config.json', 'r') as f:
            config = json.load(f)

        # افتح القالب
        base = Image.open("images/profile_template.png").convert("RGBA")

        # جيب صورة البروفايل بتاعة اليوزر
        avatar_url = user.avatar.url
        response = requests.get(avatar_url)
        avatar = Image.open(BytesIO(response.content)).convert("RGBA")

        # إعداد صورة البروفايل بشكل دائري ووضعها مكان الدائرة السوداء (حرف r)
        avatar = avatar.resize((250, 250))
        mask = Image.new("L", avatar.size, 0)
        draw_mask = ImageDraw.Draw(mask)
        draw_mask.ellipse((0, 0, avatar.size[0], avatar.size[1]), fill=255)
        avatar_left = 70
        avatar_top = 200
        base.paste(avatar, (avatar_left, avatar_top), mask)

        # تحضير الكتابة
        draw = ImageDraw.Draw(base)
        try:
            font = ImageFont.truetype("arial.ttf", 60)
        except IOError:
            font = ImageFont.load_default()

        # اسم اليوزر
        name_left = 360
        name_top = 600
        name_color = config["name"]["color"]
        draw.text((name_left, name_top), user.name, fill=name_color, font=font)

        # Level
        level_left = int(float(config["level"]["left"].replace("px", "")))
        level_top = int(float(config["level"]["top"].replace("px", "")))
        level_color = config["level"]["color"]
        draw.text((level_left, level_top), f"Level {level}", fill=level_color, font=font)

        # Coins
        coins_left = int(float(config["coins"]["left"].replace("px", "")))
        coins_top = int(float(config["coins"]["top"].replace("px", "")))
        coins_color = config["coins"]["color"]
        coins = get_user_coins(user.id)
        draw.text((coins_left, coins_top), f"{coins}", fill=coins_color, font=font)

        # XP
        xp_needed = (level + 1) ** 4
        xp_left = int(float(config["xp"]["left"].replace("px", ""))) if "xp" in config and "left" in config["xp"] else level_left
        xp_top = int(float(config["xp"]["top"].replace("px", ""))) if "xp" in config and "top" in config["xp"] else level_top + 60
        xp_color = config["xp"]["color"] if "xp" in config and "color" in config["xp"] else level_color
        draw.text((xp_left, xp_top), f"{xp}/{xp_needed}", fill=xp_color, font=font)

        # احفظ الصورة وابعتها
        with BytesIO() as image_binary:
            base.save(image_binary, 'PNG')
            image_binary.seek(0)
            await ctx.send(file=discord.File(fp=image_binary, filename='profile.png'))

    # coins command
    
    @commands.command()
    async def coins(self, ctx, member: discord.Member = None, user_id: str = None):
        """عرض رصيد العملات. يمكنك استخدام منشن أو آيدي المستخدم."""
        if member:
            target = member
        elif user_id:
            try:
                user_obj = await ctx.bot.fetch_user(int(user_id))
                target = user_obj
            except Exception:
                await ctx.send("❌ لم أجد مستخدم بهذا الآيدي.")
                return
        else:
            target = ctx.author
        coins = get_user_coins(target.id)
        await ctx.send(f"💰 رصيد {target.mention if hasattr(target, 'mention') else target}: {coins} عملة")

    @commands.command()
    async def addcoins(self, ctx, member: discord.Member, amount: int):
        """إضافة عملات لعضو (يفضل جعلها للمشرفين فقط)"""
        add_user_coins(member.id, amount)
        await ctx.send(f"✅ تم إضافة {amount} عملة لـ {member.mention}")

    @commands.command()
    async def removecoins(self, ctx, member: discord.Member, amount: int):
        """خصم عملات من عضو (يفضل جعلها للمشرفين فقط)"""
        remove_user_coins(member.id, amount)
        await ctx.send(f"✅ تم خصم {amount} عملة من {member.mention}")

    @commands.command()
    async def pay(self, ctx, member: discord.Member, amount: int):
        """تحويل عملات من عضو لعضو"""
        if member.id == ctx.author.id:
            await ctx.send("❌ لا يمكنك تحويل العملات لنفسك.")
            return
        if amount <= 0:
            await ctx.send("❌ يجب أن يكون المبلغ أكبر من صفر.")
            return
        sender_coins = get_user_coins(ctx.author.id)
        if sender_coins < amount:
            await ctx.send("❌ ليس لديك رصيد كافٍ.")
            return
        remove_user_coins(ctx.author.id, amount)
        add_user_coins(member.id, amount)
        await ctx.send(f"💸 تم تحويل {amount} عملة من {ctx.author.mention} إلى {member.mention}")

async def setup(bot):
    await bot.add_cog(Public(bot))
