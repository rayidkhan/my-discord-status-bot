const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] 
});

const WEBSITE_URL = 'https://viper-development-1.gitbook.io/viper-development-docs/'; 
const STORE_URL = 'https://viper-development.tebex.io/';
const CHANNEL_ID = '1469318831112716320'; 
let statusMessage = null; 

client.once('ready', async () => {
    console.log(`✅ Viper Status Monitor Active`);
    const channel = await client.channels.fetch(CHANNEL_ID);

    setInterval(async () => {
        let websiteOnline = false;
        let storeOnline = false;

        try {
            const res = await axios.get(WEBSITE_URL);
            if (res.status === 200) websiteOnline = true;
        } catch (e) { websiteOnline = false; }

        try {
            const resStore = await axios.get(STORE_URL);
            if (resStore.status === 200) storeOnline = true;
        } catch (e) { storeOnline = false; }

        const statusEmbed = new EmbedBuilder()
            .setTitle('🔷 VIPER DEVELOPMENT STATUS')
            .setDescription('**Live System Monitoring**')
            .addFields(
                { 
                    name: '**📖 DOCUMENTATION**', 
                    value: `${websiteOnline ? '✅ **OPERATIONAL**' : '❌ **OFFLINE**'}\n\n🔗 [Visit Site](${WEBSITE_URL})\n\n`, 
                    inline: true 
                },
                { 
                    name: '**🛒 TEBEX STORE**', 
                    value: `${storeOnline ? '✅ **OPERATIONAL**' : '❌ **OFFLINE**'}\n\n🔗 [Visit Shop](${STORE_URL})\n\n`, 
                    inline: true 
                }
            )
            .setColor(websiteOnline && storeOnline ? 0x00FF00 : 0xFF0000) // Green if all up, Red if any down
            .setThumbnail('https://i.imgur.com/your-logo-url.png') // Add your logo URL here
            .setFooter({ 
                text: '🔄 Status updates every 60 seconds • Viper Development' 
            })
            .setTimestamp();

        if (!statusMessage) {
            statusMessage = await channel.send({ embeds: [statusEmbed] });
        } else {
            await statusMessage.edit({ embeds: [statusEmbed] }).catch(() => {
                statusMessage = null; 
            });
        }
    }, 60000);
});

client.login(process.env.DISCORD_TOKEN);
