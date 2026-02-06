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

        const currentTime = new Date();
        
        // Get Unix timestamp in seconds
        const unixTimestamp = Math.floor(currentTime.getTime() / 1000);
        
        // Use Discord's relative time format (shows "X minutes ago" for each viewer)
        const relativeTime = `<t:${unixTimestamp}:R>`;
        
        // Create message content with the timestamp
        const messageContent = `**Status Updated** ${relativeTime}`;

        const statusEmbed = new EmbedBuilder()
            .setTitle('**VIPER DEVELOPMENT**')
            .setDescription('**Just code that works**')
            .addFields(
                { 
                    name: '> Docs', 
                    value: `${websiteOnline ? '```🟢 Operational```' : '```🔴 Offline```'}\n[View Site](${WEBSITE_URL})\n\n`, 
                    inline: true 
                },
                { 
                    name: '> Tebex', 
                    value: `${storeOnline ? '```🟢 Operational```' : '```🔴 Offline```'}\n[View Shop](${STORE_URL})\n\n`, 
                    inline: true 
                }
            )
            .setColor(0x2f3136)
            .setFooter({ 
                text: `Viper Development • Auto-updating every minute`
            });

        if (!statusMessage) {
            statusMessage = await channel.send({ 
                content: messageContent,
                embeds: [statusEmbed],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                style: 5,
                                label: 'Docs',
                                url: WEBSITE_URL,
                                emoji: '📖'
                            },
                            {
                                type: 2,
                                style: 5,
                                label: 'Store',
                                url: STORE_URL,
                                emoji: '🛒'
                            }
                        ]
                    }
                ]
            });
        } else {
            await statusMessage.edit({ 
                content: messageContent,
                embeds: [statusEmbed],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                style: 5,
                                label: 'Documentation',
                                url: WEBSITE_URL,
                                emoji: '📖'
                            },
                            {
                                type: 2,
                                style: 5,
                                label: 'Store',
                                url: STORE_URL,
                                emoji: '🛒'
                            }
                        ]
                    }
                ]
            }).catch(() => {
                statusMessage = null; 
            });
        }
    }, 60000);
});

client.login(process.env.DISCORD_TOKEN);
