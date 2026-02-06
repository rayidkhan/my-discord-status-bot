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
        const formattedTime = currentTime.toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).replace(',', '');

        const statusEmbed = new EmbedBuilder()
            .setTitle('# VIPER DEVELOPMENT')
            .setDescription(`**APP**\n${formattedTime}\n\n---\n\n`)
            .addFields(
                { 
                    name: '**VIPER DEVELOPMENT**', 
                    value: '**Viper Development** - The ultimate development experience! 🎉 Dive into a world of custom documentation 🏷, exclusive resources 🛒, unique tools 📜, and an active development team 🚀 ensuring top-tier services. Start strong with our starter resources 🎁 and make your mark in development! 💪 Join now and BEAT THE ODDS! 😊\n\n---\n\n', 
                    inline: false 
                },
                { 
                    name: '**DOCUMENTATION**', 
                    value: `${websiteOnline ? '✅ Operational' : '❌ Offline'}\n[View Site](${WEBSITE_URL})\n\n`, 
                    inline: true 
                },
                { 
                    name: '**TEBEX STORE**', 
                    value: `${storeOnline ? '✅ Operational' : '❌ Offline'}\n[View Shop](${STORE_URL})\n\n`, 
                    inline: true 
                }
            )
            .setColor(0x2f3136)
            .setFooter({ 
                text: `Viper Development • Updated every minute • ${currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
            });

        if (!statusMessage) {
            statusMessage = await channel.send({ 
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
            });
        } else {
            await statusMessage.edit({ 
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
