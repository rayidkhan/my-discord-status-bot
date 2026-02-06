const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages 
    ] 
});

const WEBSITE_URL = 'https://viper-development-1.gitbook.io/viper-development-docs/'; 
const CHANNEL_ID = '1469318831112716320'; 
let statusMessage = null;

client.once('ready', async () => {
    console.log(`✅ ${client.user.tag} is monitoring!`);
    
    const channel = await client.channels.fetch(CHANNEL_ID);

    const checkStatus = async () => {
        let isOnline = false;
        try {
            const res = await axios.get(WEBSITE_URL);
            if (res.status === 200) isOnline = true;
        } catch (e) { isOnline = false; }

        const statusEmbed = new EmbedBuilder()
            .setTitle('Website Status Dashboard')
            .setDescription(isOnline ? '🟢 **Operational**\n`IIIIIIIIIIIIIIIIIIII` 100%' : '🔴 **Offline**')
            .addFields({ name: 'URL', value: WEBSITE_URL })
            .setColor(isOnline ? 0x00FF00 : 0xFF0000)
            .setTimestamp();

        try {
            if (!statusMessage) {
                statusMessage = await channel.send({ embeds: [statusEmbed] });
            } else {
                await statusMessage.edit({ embeds: [statusEmbed] });
            }
        } catch (err) {
            console.error("Failed to send/edit message. Check bot permissions!");
        }
    };

    // Run immediately on startup
    await checkStatus();

    // Repeat every 5 minutes
    setInterval(checkStatus, 300000); 
});

client.login(process.env.DISCORD_TOKEN);
