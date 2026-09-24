/* ============================================================
 *  FT COURSES — the 60 modules, as lessons Rally can teach.
 *
 *  GENERATED FILE. Rebuilt from the module pages themselves, so
 *  every concept card and every question below is the course
 *  author's own wording — headings, topic sentences, quiz items
 *  and their data-why explanations, lifted verbatim. Nothing here
 *  is paraphrased: Rally teaches this material, he does not
 *  restate it.
 *
 *  Regenerate with scripts/build-courses.js after editing any
 *  *-module-*.html. Hand edits here will be overwritten.
 *
 *  60 modules · 248 concept cards · 255 questions
 * ============================================================ */
(function (global) {
    'use strict';

    const TRACKS = [
        {
            "key": "beginner",
            "name": "Beginner",
            "color": [
                "#5CB88A",
                "#3E8C65"
            ],
            "lessons": [
                {
                    "id": "beginner-1",
                    "track": "beginner",
                    "n": 1,
                    "title": "Introduction to Financial Markets",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "market",
                            "title": "What Is a Financial Market?",
                            "text": "A financial market is any marketplace where buyers and sellers participate in the trade of financial assets such as stocks, bonds, currencies, and derivatives."
                        },
                        {
                            "art": "book",
                            "title": "Real Assets vs. Financial Assets",
                            "text": "One of the first distinctions you will encounter in formal finance education is the difference between real assets and financial assets."
                        },
                        {
                            "art": "book",
                            "title": "The Three Major Types of Financial Instruments",
                            "text": "Both the MIT and Rice curricula introduce three core categories of financial instruments early on."
                        },
                        {
                            "art": "supply",
                            "title": "Why Stock Prices Move",
                            "text": "This is one of the most intuitive but also most misunderstood aspects of financial markets. At the most basic level, stock prices are determined by supply and demand."
                        },
                        {
                            "art": "risk",
                            "title": "Risk and Return: The Fundamental Tradeoff",
                            "text": "Perhaps the most important concept in all of finance is the relationship between risk and return."
                        },
                        {
                            "art": "market",
                            "title": "How Stocks Are Traded",
                            "text": "Understanding where and how trading happens is essential before you start making trades yourself."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "market",
                            "prompt": "What is the primary function of a financial market?",
                            "options": [
                                {
                                    "text": "To make stock prices go up over time"
                                },
                                {
                                    "text": "To connect those who have capital with those who need it",
                                    "correct": true
                                },
                                {
                                    "text": "To regulate how much money companies can earn"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "bond",
                            "prompt": "What is the key difference between a stock and a bond?",
                            "options": [
                                {
                                    "text": "Stocks are safer than bonds"
                                },
                                {
                                    "text": "Bonds give you ownership in a company"
                                },
                                {
                                    "text": "A stock represents ownership; a bond represents a loan",
                                    "correct": true
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "risk",
                            "prompt": "According to MIT's finance principles, why can't you earn high returns without taking risk?",
                            "options": [
                                {
                                    "text": "Because there is no such thing as a free lunch, higher returns require accepting more uncertainty",
                                    "correct": true
                                },
                                {
                                    "text": "Because the government limits safe investment returns"
                                },
                                {
                                    "text": "Because brokerages charge higher fees on safe investments"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "scale",
                            "prompt": "Price keeps bouncing at the dashed line. What is that level called?",
                            "options": [
                                {
                                    "text": "Resistance, a ceiling"
                                },
                                {
                                    "text": "Support, a floor where buyers keep stepping in",
                                    "correct": true
                                },
                                {
                                    "text": "The moving average"
                                }
                            ],
                            "why": "Support is a price where demand has repeatedly absorbed selling. Breaks below it are meaningful."
                        }
                    ]
                },
                {
                    "id": "beginner-2",
                    "track": "beginner",
                    "n": 2,
                    "title": "Reading Stock Charts",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "compound",
                            "title": "What Is a Stock Chart?",
                            "text": "A stock chart is a visual representation of trading activity over a period of time. It displays price movements, volume, and other critical data points that help traders and investors…"
                        },
                        {
                            "art": "scale",
                            "title": "Candlestick Anatomy",
                            "text": "A candlestick represents price movement over a specific timeframe—it could be 1 minute, 5 minutes, 1 hour, 1 day, or 1 week."
                        },
                        {
                            "art": "candles",
                            "title": "Timeframes: Different Tools for Different Traders",
                            "text": "The same stock can look completely different depending on the timeframe you are viewing. A stock might be in a strong uptrend on the daily chart but in a downtrend on the 1-minute chart."
                        },
                        {
                            "art": "compound",
                            "title": "Trends and Trend Lines",
                            "text": "A trend is the general direction of price movement over time. There are three types: an uptrend (higher highs and higher lows), a downtrend (lower highs and lower lows), and sideways or…"
                        },
                        {
                            "art": "candles",
                            "title": "Support and Resistance: Where the Market Decides",
                            "text": "Support is a price level where buying pressure concentrates, preventing the stock from falling further."
                        },
                        {
                            "art": "scale",
                            "title": "Volume: The Confirmation Tool",
                            "text": "Volume is the number of shares traded in a given period. While price tells you the direction the market is moving, volume tells you how strong that move is."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "What does a green candlestick indicate?",
                            "options": [
                                {
                                    "text": "The closing price is higher than the opening price",
                                    "correct": true
                                },
                                {
                                    "text": "The stock is bullish for the entire day"
                                },
                                {
                                    "text": "The high price reached was in the morning"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "candles",
                            "prompt": "Why is volume important when a stock breaks through resistance?",
                            "options": [
                                {
                                    "text": "Volume tells you how many investors are watching the stock"
                                },
                                {
                                    "text": "High volume confirms the breakout is backed by real buying power",
                                    "correct": true
                                },
                                {
                                    "text": "Volume determines how much profit you will make"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "What is the primary advantage of using larger timeframes (weekly/daily) before smaller ones?",
                            "options": [
                                {
                                    "text": "Larger timeframes are easier to read"
                                },
                                {
                                    "text": "They help you identify the major trend and avoid trading against it",
                                    "correct": true
                                },
                                {
                                    "text": "Smaller timeframes are not used by professional traders"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The green bars show volume. What does the tall bar during the breakout tell you?",
                            "options": [
                                {
                                    "text": "Nothing, volume is noise"
                                },
                                {
                                    "text": "Conviction, many participants confirmed the move",
                                    "correct": true
                                },
                                {
                                    "text": "The stock is about to split"
                                }
                            ],
                            "why": "Breakouts on heavy volume are far more reliable than moves on thin trading — volume is the fuel."
                        }
                    ]
                },
                {
                    "id": "beginner-3",
                    "track": "beginner",
                    "n": 3,
                    "title": "Building Your Portfolio",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "diversify",
                            "title": "What Is a Portfolio?",
                            "text": "A portfolio is a collection of investments held by an individual or institution. It may contain stocks, bonds, cash, real estate, or any combination of assets."
                        },
                        {
                            "art": "diversify",
                            "title": "Diversification",
                            "text": "Diversification means spreading your investment capital across multiple securities and asset classes so that the poor performance of one holding does not destroy your entire portfolio."
                        },
                        {
                            "art": "diversify",
                            "title": "Asset Allocation",
                            "text": "Asset allocation is the process of deciding what percentage of your portfolio to hold in stocks, bonds, cash, and other asset classes."
                        },
                        {
                            "art": "risk",
                            "title": "Risk Management Basics",
                            "text": "Even with diversification and a well-thought-out asset allocation, individual positions can go wrong."
                        },
                        {
                            "art": "bond",
                            "title": "Portfolio Rebalancing",
                            "text": "Over time, your portfolio allocation drifts. Suppose you start with a 60/40 stock-to-bond split."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "risk",
                            "prompt": "According to Markowitz's diversification principle, why does combining uncorrelated assets reduce risk?",
                            "options": [
                                {
                                    "text": "Because uncorrelated assets always earn higher returns"
                                },
                                {
                                    "text": "Because when some assets decline, others often hold value or rise, smoothing overall returns",
                                    "correct": true
                                },
                                {
                                    "text": "Because investors are more confident holding multiple assets"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "compound",
                            "prompt": "You are 30 years old with a 35-year time horizon until retirement. Which asset allocation best matches your profile?",
                            "options": [
                                {
                                    "text": "30% stocks, 60% bonds, 10% cash (Conservative)"
                                },
                                {
                                    "text": "85% stocks, 10% bonds, 5% cash (Aggressive)",
                                    "correct": true
                                },
                                {
                                    "text": "You should hold only stocks, no bonds or cash"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "diversify",
                            "prompt": "You have a $100,000 portfolio and buy a stock for $10,000. After one year, the company faces legal troubles and the stock falls to $5,000. What fundamental risk management principle did you likely violate?",
                            "options": [
                                {
                                    "text": "Position sizing, the stock represented 10% of your portfolio, which is at the upper limit",
                                    "correct": true
                                },
                                {
                                    "text": "Diversification, you should own only bonds, not stocks"
                                },
                                {
                                    "text": "Asset allocation. 60/40 portfolios always lose money"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "scale",
                            "prompt": "Two trades, both risking $100 (red). Which setup is worth taking?",
                            "options": [
                                {
                                    "text": "Trade A, smaller target hits more often"
                                },
                                {
                                    "text": "Trade B. $300 upside against $100 risk can be wrong twice and still profit",
                                    "correct": true
                                },
                                {
                                    "text": "Both are identical"
                                }
                            ],
                            "why": "With 3:1 reward-to-risk you only need to be right ~30% of the time to make money. Asymmetry is the edge."
                        }
                    ]
                },
                {
                    "id": "beginner-4",
                    "track": "beginner",
                    "n": 4,
                    "title": "Fundamental Analysis",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "dividend",
                            "title": "What Is Fundamental Analysis?",
                            "text": "At its core, fundamental analysis compares a company's stock price to measurable financial metrics: revenue, earnings, assets, liabilities, and cash flow."
                        },
                        {
                            "art": "book",
                            "title": "The Three Financial Statements",
                            "text": "Every publicly traded company publishes three core financial statements each quarter and year. Together, they paint a complete picture of a company's health, profitability, and financial…"
                        },
                        {
                            "art": "risk",
                            "title": "Key Financial Ratios",
                            "text": "Financial ratios distill a company's statements into a few crucial metrics that let you quickly assess value, profitability, leverage, and efficiency."
                        },
                        {
                            "art": "compound",
                            "title": "Growth vs. Value Investing",
                            "text": "Two major schools of thought exist in fundamental analysis. Growth investors focus on companies with rapidly expanding revenues and earnings, accepting high P/E ratios in exchange for the…"
                        },
                        {
                            "art": "scale",
                            "title": "Industry Analysis: Context Matters",
                            "text": "A critical mistake is evaluating a company's ratios in isolation. A P/E of 30 is alarming for a grocery chain (mature, stable, predictable) but reasonable for a software company (high…"
                        },
                        {
                            "art": "diversify",
                            "title": "How to Use Fundamental Analysis in Practice",
                            "text": "In FantasyTrader, you will apply these ideas by: (1) selecting a stock from the portfolio universe; (2) pulling up its latest financial statements (available through company fact sheets)…"
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "target",
                            "prompt": "What is the primary goal of fundamental analysis?",
                            "options": [
                                {
                                    "text": "To identify short-term price trends using historical charts"
                                },
                                {
                                    "text": "To estimate a company's intrinsic value and compare it to its market price",
                                    "correct": true
                                },
                                {
                                    "text": "To predict the stock market's overall direction"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "dividend",
                            "prompt": "Which of the following best describes the purpose of a cash flow statement?",
                            "options": [
                                {
                                    "text": "To show how much profit a company made in the accounting period"
                                },
                                {
                                    "text": "To track actual cash entering and leaving the company, separate from accounting profit",
                                    "correct": true
                                },
                                {
                                    "text": "To list all the company's assets and liabilities at a single point in time"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "balance",
                            "prompt": "Why is it important to compare a company's ratios to its industry peers rather than the S&P 500 average?",
                            "options": [
                                {
                                    "text": "Because the S&P 500 only includes large companies"
                                },
                                {
                                    "text": "Because different industries have different growth rates, margins, and risk profiles; a healthy ratio varies by industry",
                                    "correct": true
                                },
                                {
                                    "text": "Because peer companies always have the same profitability as your target stock"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "risk",
                            "prompt": "The line falls from $100 to $80, then recovers to $95 before rolling over. Where was the smart stop-loss?",
                            "options": [
                                {
                                    "text": "No stop, conviction means holding"
                                },
                                {
                                    "text": "Just below entry, set BEFORE the trade, small loss, no ride to $80",
                                    "correct": true
                                },
                                {
                                    "text": "After it hit $80"
                                }
                            ],
                            "why": "Stops are decided when you are calm, not after the drop. The trade failed at -3%, not -20%."
                        }
                    ]
                },
                {
                    "id": "beginner-5",
                    "track": "beginner",
                    "n": 5,
                    "title": "Trading Strategies",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "market",
                            "title": "Why You Need a Strategy",
                            "text": "Trading without a plan is gambling. Research from behavioral finance—a field pioneered by behavioral economists and extensively studied in MIT's 15."
                        },
                        {
                            "art": "clock",
                            "title": "Buy and Hold",
                            "text": "The simplest and historically most effective strategy for beginners is buy and hold: purchase quality stocks and hold them for years or decades."
                        },
                        {
                            "art": "scale",
                            "title": "Dollar-Cost Averaging (DCA)",
                            "text": "Dollar-cost averaging is a systematic approach where you invest a fixed amount at regular intervals—monthly, quarterly, or annually—regardless of the stock's price."
                        },
                        {
                            "art": "risk",
                            "title": "Setting Investment Goals",
                            "text": "Different investment goals require different strategies. Your time horizon, risk tolerance, and return expectations should dictate your approach."
                        },
                        {
                            "art": "market",
                            "title": "Creating a Trading Plan",
                            "text": "A written trading plan should include five components:"
                        },
                        {
                            "art": "book",
                            "title": "Common Beginner Mistakes",
                            "text": "Four costly errors derail most new investors:"
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "market",
                            "prompt": "What is the main advantage of following a written trading strategy?",
                            "options": [
                                {
                                    "text": "It guarantees you will make profits on every trade"
                                },
                                {
                                    "text": "It removes emotion from decision-making and increases consistency",
                                    "correct": true
                                },
                                {
                                    "text": "It allows you to trade whenever you feel like it"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Which of the following is a key benefit of dollar-cost averaging?",
                            "options": [
                                {
                                    "text": "You buy more shares when the price is high"
                                },
                                {
                                    "text": "You remove the pressure to time the market and often achieve a lower average purchase price",
                                    "correct": true
                                },
                                {
                                    "text": "It eliminates market volatility entirely"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "compound",
                            "prompt": "For a long-term retirement goal (20+ years away), what is the most appropriate investment allocation?",
                            "options": [
                                {
                                    "text": "Primarily bonds and cash to avoid risk"
                                },
                                {
                                    "text": "Majority stocks with diversification, because time allows recovery from market downturns",
                                    "correct": true
                                },
                                {
                                    "text": "Gold and precious metals only"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "scale",
                            "prompt": "Price keeps bouncing at the dashed line. What is that level called?",
                            "options": [
                                {
                                    "text": "Resistance, a ceiling"
                                },
                                {
                                    "text": "Support, a floor where buyers keep stepping in",
                                    "correct": true
                                },
                                {
                                    "text": "The moving average"
                                }
                            ],
                            "why": "Support is a price where demand has repeatedly absorbed selling. Breaks below it are meaningful."
                        }
                    ]
                },
                {
                    "id": "beginner-6",
                    "track": "beginner",
                    "n": 6,
                    "title": "Learn the News",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "book",
                            "title": "Why News Matters for Traders",
                            "text": "Financial markets are information-processing machines. The moment new information becomes available, prices shift to reflect it."
                        },
                        {
                            "art": "market",
                            "title": "Types of Market News",
                            "text": "Not all news moves markets equally. Understanding the distinction between macro and micro news is essential for prioritizing what to monitor and when to act."
                        },
                        {
                            "art": "clock",
                            "title": "Reading Earnings Headlines",
                            "text": "Earnings season, when companies report quarterly results, is one of the most news-dense periods for traders."
                        },
                        {
                            "art": "market",
                            "title": "Timing and Market Reactions",
                            "text": "The timing of news release shapes how quickly and dramatically the market reacts. Major earnings releases happen during three windows: pre-market (before 9:30 AM), market hours (9:30 AM to…"
                        },
                        {
                            "art": "book",
                            "title": "Building a News Checklist",
                            "text": "As a trader, you cannot monitor every piece of news across every company. Instead, develop a systematic framework for filtering signal from noise."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "market",
                            "prompt": "According to the Efficient Market Hypothesis, what happens when new information becomes available?",
                            "options": [
                                {
                                    "text": "Stock prices adjust quickly to reflect the new information",
                                    "correct": true
                                },
                                {
                                    "text": "Stock prices remain stable until the next earnings announcement"
                                },
                                {
                                    "text": "Only professional traders benefit from new information"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "clock",
                            "prompt": "Why can a stock sometimes drop when a company beats earnings?",
                            "options": [
                                {
                                    "text": "Because analysts made an error in their estimates"
                                },
                                {
                                    "text": "Because forward guidance is weak or growth expectations are disappointed",
                                    "correct": true
                                },
                                {
                                    "text": "Because the market always sells good news"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "What is the primary advantage of an economic calendar in your daily news routine?",
                            "options": [
                                {
                                    "text": "It predicts which stocks will rise next week"
                                },
                                {
                                    "text": "It alerts you to scheduled macro data releases that may affect the entire market",
                                    "correct": true
                                },
                                {
                                    "text": "It replaces the need to read financial headlines"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The green bars show volume. What does the tall bar during the breakout tell you?",
                            "options": [
                                {
                                    "text": "Nothing, volume is noise"
                                },
                                {
                                    "text": "Conviction, many participants confirmed the move",
                                    "correct": true
                                },
                                {
                                    "text": "The stock is about to split"
                                }
                            ],
                            "why": "Breakouts on heavy volume are far more reliable than moves on thin trading — volume is the fuel."
                        }
                    ]
                }
            ]
        },
        {
            "key": "intermediate",
            "name": "Intermediate",
            "color": [
                "#E0A24C",
                "#B37C33"
            ],
            "lessons": [
                {
                    "id": "intermediate-1",
                    "track": "intermediate",
                    "n": 1,
                    "title": "Technical Indicators",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "candles",
                            "title": "Why Technical Indicators Matter",
                            "text": "Technical indicators are tools that turn price and volume data into readable signals. Think of them like a dashboard in a car."
                        },
                        {
                            "art": "diversify",
                            "title": "RSI: Relative Strength Index",
                            "text": "RSI is like a speedometer for stock momentum. It runs from 0 to 100."
                        },
                        {
                            "art": "candles",
                            "title": "MACD: Moving Average Convergence Divergence",
                            "text": "MACD is a trend-following indicator that watches for momentum shifts. It compares two averages of price: a faster one (12 days) and a slower one (26 days)."
                        },
                        {
                            "art": "candles",
                            "title": "Moving Averages: Golden Cross & Death Cross",
                            "text": "A moving average smooths out daily price wiggles to show you the real trend. It's like squinting at a chart to see the big picture."
                        },
                        {
                            "art": "candles",
                            "title": "Bollinger Bands: Volatility & Support/Resistance",
                            "text": "Bollinger Bands are like guardrails around price movement. They're built from a 20-day average with an upper and lower band set 2 standard deviations away."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "What RSI value typically signals an overbought condition?",
                            "options": [
                                {
                                    "text": "Below 30"
                                },
                                {
                                    "text": "Above 70",
                                    "correct": true
                                },
                                {
                                    "text": "Between 50 and 60"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "clock",
                            "prompt": "When the 50-day MA crosses above the 200-day MA, what is this called?",
                            "options": [
                                {
                                    "text": "Golden cross",
                                    "correct": true
                                },
                                {
                                    "text": "Death cross"
                                },
                                {
                                    "text": "Bollinger squeeze"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Which indicator is best for spotting volatility breakouts?",
                            "options": [
                                {
                                    "text": "RSI"
                                },
                                {
                                    "text": "Bollinger Bands",
                                    "correct": true
                                },
                                {
                                    "text": "Moving Average"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "scale",
                            "prompt": "Price keeps bouncing at the dashed line. What is that level called?",
                            "options": [
                                {
                                    "text": "Resistance, a ceiling"
                                },
                                {
                                    "text": "Support, a floor where buyers keep stepping in",
                                    "correct": true
                                },
                                {
                                    "text": "The moving average"
                                }
                            ],
                            "why": "Support is a price where demand has repeatedly absorbed selling. Breaks below it are meaningful."
                        }
                    ]
                },
                {
                    "id": "intermediate-2",
                    "track": "intermediate",
                    "n": 2,
                    "title": "Options Basics",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "scale",
                            "title": "What is an Option?",
                            "text": "An option is a bet on stock price movement without owning the stock itself. You pay a small fee upfront (called the premium) for the right—but not the obligation—to buy or sell 100 shares…"
                        },
                        {
                            "art": "scale",
                            "title": "Calls vs. Puts",
                            "text": "A call is a bet that a stock will rise. You pay a small premium for the right to buy at a fixed strike price."
                        },
                        {
                            "art": "scale",
                            "title": "Strike Price & Expiration",
                            "text": "The strike price is your fixed price level. It never changes—that's the whole point."
                        },
                        {
                            "art": "compound",
                            "title": "Intrinsic Value vs Time Value",
                            "text": "Every option premium has two parts. Intrinsic value is the profit you'd lock in right now if you exercised."
                        },
                        {
                            "art": "dividend",
                            "title": "Basic Strategies",
                            "text": "You own 100 shares and sell a call on top of them to collect premium. It's like renting out your shares for income."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "A call option gives you the right to:",
                            "options": [
                                {
                                    "text": "Buy at the strike price",
                                    "correct": true
                                },
                                {
                                    "text": "Sell at the strike price"
                                },
                                {
                                    "text": "Hold the stock indefinitely"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "An option's total premium is made up of:",
                            "options": [
                                {
                                    "text": "Only intrinsic value"
                                },
                                {
                                    "text": "Intrinsic value + time value",
                                    "correct": true
                                },
                                {
                                    "text": "Only the strike price"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "In a covered call strategy, what is capped?",
                            "options": [
                                {
                                    "text": "Your downside losses"
                                },
                                {
                                    "text": "Your upside gains",
                                    "correct": true
                                },
                                {
                                    "text": "The premium you collect"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The green bars show volume. What does the tall bar during the breakout tell you?",
                            "options": [
                                {
                                    "text": "Nothing, volume is noise"
                                },
                                {
                                    "text": "Conviction, many participants confirmed the move",
                                    "correct": true
                                },
                                {
                                    "text": "The stock is about to split"
                                }
                            ],
                            "why": "Breakouts on heavy volume are far more reliable than moves on thin trading — volume is the fuel."
                        }
                    ]
                },
                {
                    "id": "intermediate-3",
                    "track": "intermediate",
                    "n": 3,
                    "title": "Sector Analysis",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "market",
                            "title": "The 11 GICS Sectors",
                            "text": "Think of the stock market as divided into 11 neighborhoods, each with different personalities. The S&P divides the market this way: Technology (Apple, Microsoft), Healthcare (pharmaceutical…"
                        },
                        {
                            "art": "clock",
                            "title": "Economic Cycle & Sector Rotation",
                            "text": "The economy moves in a predictable four-part cycle. Early in a recovery (when the economy is just waking up), people and businesses start hiring again—Tech and Industrials lead because they…"
                        },
                        {
                            "art": "market",
                            "title": "How to Evaluate Sector Strength",
                            "text": "Compare each sector to the overall market (S&P 500). If Technology is up 20% while the broader market is up only 10%, Tech is running hot and outperforming."
                        },
                        {
                            "art": "book",
                            "title": "Sector ETFs as Tools",
                            "text": "Sector ETFs are your shortcut to betting on entire sectors without picking individual stocks. XLK tracks Technology, XLV tracks Healthcare, XLF tracks Financials, etc."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Which sector typically leads in early economic recovery?",
                            "options": [
                                {
                                    "text": "Technology and Industrials",
                                    "correct": true
                                },
                                {
                                    "text": "Utilities and Consumer Staples"
                                },
                                {
                                    "text": "Real Estate and Energy"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Which sector is most defensive during a recession?",
                            "options": [
                                {
                                    "text": "Consumer Discretionary"
                                },
                                {
                                    "text": "Consumer Staples",
                                    "correct": true
                                },
                                {
                                    "text": "Technology"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "How many sectors are in the GICS classification?",
                            "options": [
                                {
                                    "text": "8"
                                },
                                {
                                    "text": "11",
                                    "correct": true
                                },
                                {
                                    "text": "15"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "scale",
                            "prompt": "Two trades, both risking $100 (red). Which setup is worth taking?",
                            "options": [
                                {
                                    "text": "Trade A, smaller target hits more often"
                                },
                                {
                                    "text": "Trade B. $300 upside against $100 risk can be wrong twice and still profit",
                                    "correct": true
                                },
                                {
                                    "text": "Both are identical"
                                }
                            ],
                            "why": "With 3:1 reward-to-risk you only need to be right ~30% of the time to make money. Asymmetry is the edge."
                        }
                    ]
                },
                {
                    "id": "intermediate-4",
                    "track": "intermediate",
                    "n": 4,
                    "title": "Advanced Portfolio Management",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "book",
                            "title": "Correlation & Diversification Math",
                            "text": "Correlation measures how two assets move together. Think of it like a dancefloor: some stocks dance together (high positive correlation), some move independently (correlation near zero)…"
                        },
                        {
                            "art": "diversify",
                            "title": "Hedging Strategies",
                            "text": "A hedge is like insurance on your portfolio. You pay a small price today to protect against a big loss tomorrow."
                        },
                        {
                            "art": "risk",
                            "title": "Tax-Loss Harvesting",
                            "text": "Tax-loss harvesting is a legal trick to save money on taxes. When a stock drops and you have a loss on paper, sell it to lock in that loss for tax purposes."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "A correlation of 0 between two assets means:",
                            "options": [
                                {
                                    "text": "They move completely independently",
                                    "correct": true
                                },
                                {
                                    "text": "They move in perfect sync"
                                },
                                {
                                    "text": "They move in opposite directions"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "What is the wash-sale rule?",
                            "options": [
                                {
                                    "text": "You can't sell at a loss"
                                },
                                {
                                    "text": "You can't buy the same security within 30 days of selling at a loss",
                                    "correct": true
                                },
                                {
                                    "text": "You must rebalance every month"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Which rebalancing method is best for passive investors?",
                            "options": [
                                {
                                    "text": "Calendar rebalancing",
                                    "correct": true
                                },
                                {
                                    "text": "Threshold rebalancing"
                                },
                                {
                                    "text": "Daily rebalancing"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "risk",
                            "prompt": "The line falls from $100 to $80, then recovers to $95 before rolling over. Where was the smart stop-loss?",
                            "options": [
                                {
                                    "text": "No stop, conviction means holding"
                                },
                                {
                                    "text": "Just below entry, set BEFORE the trade, small loss, no ride to $80",
                                    "correct": true
                                },
                                {
                                    "text": "After it hit $80"
                                }
                            ],
                            "why": "Stops are decided when you are calm, not after the drop. The trade failed at -3%, not -20%."
                        }
                    ]
                },
                {
                    "id": "intermediate-5",
                    "track": "intermediate",
                    "n": 5,
                    "title": "Earnings & Valuation Models",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "market",
                            "title": "Reading Earnings Reports",
                            "text": "Earnings reports come out quarterly, and traders obsess over them. The market doesn't care about the absolute number—it cares about the surprise."
                        },
                        {
                            "art": "scale",
                            "title": "P/E Ratio: Deeper Dive",
                            "text": "P/E is the price tag on earnings. P/E = Stock Price / EPS."
                        },
                        {
                            "art": "dividend",
                            "title": "DCF: Discounted Cash Flow (Simplified)",
                            "text": "DCF is like asking: \"How much is this company's future cash worth in today's dollars? \" You project the cash the company will generate each year, then \"discount\" (reduce) each year's value…"
                        },
                        {
                            "art": "market",
                            "title": "Comparable Company Analysis",
                            "text": "Comparable company analysis (often called \"comps\") is the lazy investor's shortcut: Instead of projecting cash flows for years, find similar companies and see what multiples the market pays…"
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "scale",
                            "prompt": "What does a P/E of 25 mean?",
                            "options": [
                                {
                                    "text": "Investors pay $25 for every $1 of earnings",
                                    "correct": true
                                },
                                {
                                    "text": "The stock will earn $25 per share"
                                },
                                {
                                    "text": "The company has 25x more debt than equity"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "scale",
                            "prompt": "Which P/E is forward-looking?",
                            "options": [
                                {
                                    "text": "Trailing P/E"
                                },
                                {
                                    "text": "Forward P/E",
                                    "correct": true
                                },
                                {
                                    "text": "Both are backward-looking"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "risk",
                            "prompt": "What is the main risk of DCF analysis?",
                            "options": [
                                {
                                    "text": "Valuation is highly sensitive to discount rate assumptions",
                                    "correct": true
                                },
                                {
                                    "text": "It ignores competitor pricing"
                                },
                                {
                                    "text": "It's too simple for complex companies"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "scale",
                            "prompt": "Price keeps bouncing at the dashed line. What is that level called?",
                            "options": [
                                {
                                    "text": "Resistance, a ceiling"
                                },
                                {
                                    "text": "Support, a floor where buyers keep stepping in",
                                    "correct": true
                                },
                                {
                                    "text": "The moving average"
                                }
                            ],
                            "why": "Support is a price where demand has repeatedly absorbed selling. Breaks below it are meaningful."
                        }
                    ]
                },
                {
                    "id": "intermediate-6",
                    "track": "intermediate",
                    "n": 6,
                    "title": "Market Psychology",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "market",
                            "title": "Why Psychology Matters in Markets",
                            "text": "The stock market isn't driven by rational analysis—it's driven by human emotions. Fear, greed, panic, and euphoria move prices more than earnings do."
                        },
                        {
                            "art": "risk",
                            "title": "Common Behavioral Biases",
                            "text": "Pain from a $1,000 loss feels worse than joy from a $1,000 gain. This makes people hold losing stocks way too long, hoping to break even (never happens), while selling winners too early to…"
                        },
                        {
                            "art": "bond",
                            "title": "Fear & Greed Index",
                            "text": "The Fear & Greed Index is a simple tool that measures market sentiment on a 0-100 scale. It combines several indicators (put/call ratios, market momentum, junk bond spreads, etc."
                        },
                        {
                            "art": "warning",
                            "title": "Contrarian Investing",
                            "text": "Contrarians are the investors with ice in their veins. They profit by doing what crowds fear: buying during crashes (when everyone is selling) and selling during rallies (when everyone is…"
                        },
                        {
                            "art": "market",
                            "title": "Sentiment & Volume Analysis",
                            "text": "Sentiment and volume are the pulse of the market. High volume on down days often signals capitulation (panic selling), which creates opportunities."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "risk",
                            "prompt": "What is loss aversion?",
                            "options": [
                                {
                                    "text": "The tendency to feel losses twice as intensely as equivalent gains",
                                    "correct": true
                                },
                                {
                                    "text": "The inability to lose money in the market"
                                },
                                {
                                    "text": "A fear of losing your broker"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "diversify",
                            "prompt": "What Fear & Greed Index score signals extreme fear?",
                            "options": [
                                {
                                    "text": "Below 30",
                                    "correct": true
                                },
                                {
                                    "text": "Between 50-60"
                                },
                                {
                                    "text": "Above 70"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "clock",
                            "prompt": "What does a contrarian do when prices are falling on high volume?",
                            "options": [
                                {
                                    "text": "Buy, expecting a reversal",
                                    "correct": true
                                },
                                {
                                    "text": "Panic sell with the crowd"
                                },
                                {
                                    "text": "Hold and do nothing"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The green bars show volume. What does the tall bar during the breakout tell you?",
                            "options": [
                                {
                                    "text": "Nothing, volume is noise"
                                },
                                {
                                    "text": "Conviction, many participants confirmed the move",
                                    "correct": true
                                },
                                {
                                    "text": "The stock is about to split"
                                }
                            ],
                            "why": "Breakouts on heavy volume are far more reliable than moves on thin trading — volume is the fuel."
                        }
                    ]
                }
            ]
        },
        {
            "key": "advanced",
            "name": "Advanced",
            "color": [
                "#D9645C",
                "#A6443D"
            ],
            "lessons": [
                {
                    "id": "advanced-1",
                    "track": "advanced",
                    "n": 1,
                    "title": "Derivatives & Complex Instruments",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "scale",
                            "title": "Futures Contracts: The Basics",
                            "text": "A futures contract is a standardized agreement to buy or sell an asset at a fixed price on a future date."
                        },
                        {
                            "art": "risk",
                            "title": "Margin, Leverage, and Settlement",
                            "text": "Futures require margin deposits (typically 5%-20% of contract value), enabling 5x-20x leverage."
                        },
                        {
                            "art": "diversify",
                            "title": "Interest Rate Swaps",
                            "text": "A swap is a bilateral agreement to exchange cash flows. In a fixed-for-floating interest rate swap, one party pays fixed interest while receiving floating (usually LIBOR+spread)."
                        },
                        {
                            "art": "risk",
                            "title": "Structured Products: Turning Risk into Returns",
                            "text": "Structured products combine bonds with derivatives to create custom payoff profiles. A reverse convertible pays high coupons but converts to stock if it falls below a barrier."
                        },
                        {
                            "art": "risk",
                            "title": "Margin Trading and Leverage Risk",
                            "text": "Margin allows borrowing against securities to increase position size. A 50% margin requirement means $1 can control $2 of stock."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "What is the primary advantage of a futures contract over a forward contract?",
                            "options": [
                                {
                                    "text": "Daily mark-to-market settlement reduces counterparty risk",
                                    "correct": true
                                },
                                {
                                    "text": "Futures are always cheaper than forwards"
                                },
                                {
                                    "text": "Futures can be held indefinitely without expiration"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "In a fixed-for-floating interest rate swap, what does the fixed-rate payer receive?",
                            "options": [
                                {
                                    "text": "Floating-rate payments linked to a reference rate like SOFR",
                                    "correct": true
                                },
                                {
                                    "text": "Cash at settlement equal to the notional amount"
                                },
                                {
                                    "text": "The right to call the swap at any time"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "risk",
                            "prompt": "What is the primary risk of using 20x leverage in a futures position?",
                            "options": [
                                {
                                    "text": "You cannot sell your position once bought"
                                },
                                {
                                    "text": "A 5% adverse move in the underlying wipes out 100% of your capital",
                                    "correct": true
                                },
                                {
                                    "text": "Leverage is illegal in most jurisdictions"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "scale",
                            "prompt": "Price keeps bouncing at the dashed line. What is that level called?",
                            "options": [
                                {
                                    "text": "Resistance, a ceiling"
                                },
                                {
                                    "text": "Support, a floor where buyers keep stepping in",
                                    "correct": true
                                },
                                {
                                    "text": "The moving average"
                                }
                            ],
                            "why": "Support is a price where demand has repeatedly absorbed selling. Breaks below it are meaningful."
                        }
                    ]
                },
                {
                    "id": "advanced-2",
                    "track": "advanced",
                    "n": 2,
                    "title": "Quantitative Analysis",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "market",
                            "title": "Linear Regression for Stock Prediction",
                            "text": "Linear regression models relationships between variables. In finance, we regress stock returns against market returns: Return = α + β × Market_Return + ε."
                        },
                        {
                            "art": "risk",
                            "title": "Fama-French Factor Models",
                            "text": "The Fama-French 5-factor model explains returns using 5 systematic factors: market risk, size (small-cap premium), value (cheap stocks outperform), profitability, and investment…"
                        },
                        {
                            "art": "book",
                            "title": "Backtesting: Where Reality Checks Theory",
                            "text": "Backtesting applies a strategy to historical data to measure past performance. Use in-sample data (training) and out-of-sample data (testing) to prevent overfitting."
                        },
                        {
                            "art": "risk",
                            "title": "Performance Metrics Beyond Returns",
                            "text": "Sharpe Ratio = (Return - Risk-Free Rate) / Volatility. Higher is better."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "What does a beta of 1.5 mean?",
                            "options": [
                                {
                                    "text": "The stock is 50% more volatile than the market",
                                    "correct": true
                                },
                                {
                                    "text": "The stock returns 50% more than the market"
                                },
                                {
                                    "text": "The stock will outperform by 50%"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "risk",
                            "prompt": "What is the primary danger of backtesting?",
                            "options": [
                                {
                                    "text": "Overfitting to historical data that doesn't generalize to future markets",
                                    "correct": true
                                },
                                {
                                    "text": "Backtests are always 100% accurate predictors"
                                },
                                {
                                    "text": "Using too little data makes backtests more reliable"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "What is the key advantage of Sortino Ratio over Sharpe Ratio?",
                            "options": [
                                {
                                    "text": "Sortino is always higher than Sharpe"
                                },
                                {
                                    "text": "Sortino penalizes only downside volatility, not upside",
                                    "correct": true
                                },
                                {
                                    "text": "Sortino accounts for leverage"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The green bars show volume. What does the tall bar during the breakout tell you?",
                            "options": [
                                {
                                    "text": "Nothing, volume is noise"
                                },
                                {
                                    "text": "Conviction, many participants confirmed the move",
                                    "correct": true
                                },
                                {
                                    "text": "The stock is about to split"
                                }
                            ],
                            "why": "Breakouts on heavy volume are far more reliable than moves on thin trading — volume is the fuel."
                        }
                    ]
                },
                {
                    "id": "advanced-3",
                    "track": "advanced",
                    "n": 3,
                    "title": "Alternative Investments",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "dividend",
                            "title": "Real Estate Investment Trusts (REITs)",
                            "text": "REITs own and operate income-producing real estate. Unlike owning a property directly, REITs are liquid, diversified, and tax-advantaged."
                        },
                        {
                            "art": "book",
                            "title": "Commodities & Commodity Futures",
                            "text": "Commodities include precious metals (gold, silver), energy (oil, natural gas), and agriculture (wheat, corn)."
                        },
                        {
                            "art": "supply",
                            "title": "Cryptocurrency & Blockchain Basics",
                            "text": "Bitcoin (BTC) and Ethereum (ETH) are decentralized digital currencies secured by blockchain. Bitcoin's supply is capped at 21 million, creating scarcity."
                        },
                        {
                            "art": "growth",
                            "title": "Private Equity & Venture Capital Overview",
                            "text": "Private equity firms buy companies, improve operations, and exit for profit. Venture capital funds early-stage startups."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "What must REITs distribute annually?",
                            "options": [
                                {
                                    "text": "At least 90% of taxable income as dividends",
                                    "correct": true
                                },
                                {
                                    "text": "All capital gains from property sales"
                                },
                                {
                                    "text": "50% of revenue"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "market",
                            "prompt": "Why is gold considered a hedge during equity market crashes?",
                            "options": [
                                {
                                    "text": "Gold always rises when stocks fall"
                                },
                                {
                                    "text": "Gold has negative/zero correlation with stocks and maintains value during uncertainty",
                                    "correct": true
                                },
                                {
                                    "text": "Gold prices are regulated by governments"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "What is the primary limitation of private equity as an investment?",
                            "options": [
                                {
                                    "text": "Private equity returns are always negative"
                                },
                                {
                                    "text": "5-10 year lockups mean capital is unavailable for emergencies or better opportunities",
                                    "correct": true
                                },
                                {
                                    "text": "Private equity is only available to billionaires"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "scale",
                            "prompt": "Two trades, both risking $100 (red). Which setup is worth taking?",
                            "options": [
                                {
                                    "text": "Trade A, smaller target hits more often"
                                },
                                {
                                    "text": "Trade B. $300 upside against $100 risk can be wrong twice and still profit",
                                    "correct": true
                                },
                                {
                                    "text": "Both are identical"
                                }
                            ],
                            "why": "With 3:1 reward-to-risk you only need to be right ~30% of the time to make money. Asymmetry is the edge."
                        }
                    ]
                },
                {
                    "id": "advanced-4",
                    "track": "advanced",
                    "n": 4,
                    "title": "Global Markets & Macroeconomics",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "book",
                            "title": "Forex Fundamentals: Currency Pairs & Pips",
                            "text": "Currency pairs trade with one currency against another: EUR/USD means Euros per Dollar. If EUR/USD = 1."
                        },
                        {
                            "art": "book",
                            "title": "International Diversification Benefits",
                            "text": "Stocks in different countries have low correlation. U."
                        },
                        {
                            "art": "bond",
                            "title": "Interest Rates & Bond Market Dynamics",
                            "text": "Bond prices move inversely to yields. When Fed raises rates 1%, existing 10-year bonds drop 8-12% in price."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "bond",
                            "prompt": "If you hold a 10-year bond with 8-year duration and rates rise 1%, what happens to your bond's value?",
                            "options": [
                                {
                                    "text": "It drops approximately 8% in market value",
                                    "correct": true
                                },
                                {
                                    "text": "It rises because you own a fixed coupon"
                                },
                                {
                                    "text": "It stays unchanged"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "bond",
                            "prompt": "What does a yield curve inversion signal?",
                            "options": [
                                {
                                    "text": "Strong economic growth"
                                },
                                {
                                    "text": "Recession risk within 6-12 months",
                                    "correct": true
                                },
                                {
                                    "text": "Central banks will cut rates immediately"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "How does quantitative easing (QE) typically affect asset prices?",
                            "options": [
                                {
                                    "text": "It causes immediate market crashes"
                                },
                                {
                                    "text": "It increases liquidity and raises valuations across stocks and bonds",
                                    "correct": true
                                },
                                {
                                    "text": "It has no effect on markets"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "risk",
                            "prompt": "The line falls from $100 to $80, then recovers to $95 before rolling over. Where was the smart stop-loss?",
                            "options": [
                                {
                                    "text": "No stop, conviction means holding"
                                },
                                {
                                    "text": "Just below entry, set BEFORE the trade, small loss, no ride to $80",
                                    "correct": true
                                },
                                {
                                    "text": "After it hit $80"
                                }
                            ],
                            "why": "Stops are decided when you are calm, not after the drop. The trade failed at -3%, not -20%."
                        }
                    ]
                },
                {
                    "id": "advanced-5",
                    "track": "advanced",
                    "n": 5,
                    "title": "Risk Management & Value at Risk",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "risk",
                            "title": "Value at Risk (VaR): Three Approaches",
                            "text": "VaR answers: \"What's my worst expected loss at 95% confidence over 1 day? \" If 1-day VaR is $100K, you expect losses exceeding $100K on only 1 in 20 days."
                        },
                        {
                            "art": "market",
                            "title": "Stress Testing & Scenario Analysis",
                            "text": "Stress testing applies extreme market scenarios: -20% stocks, Fed +5% rates, VIX +200%. Scenario analysis asks \"What if 2008 crashes again?"
                        },
                        {
                            "art": "book",
                            "title": "Options Greeks: Measuring Sensitivity",
                            "text": "Delta = change in option value per $1 move in stock. Call delta ranges 0-1; put delta ranges -1 to 0."
                        },
                        {
                            "art": "diversify",
                            "title": "Portfolio Insurance: Hedging Catastrophic Risk",
                            "text": "Portfolio insurance combines long stocks with put options to cap losses. If you own $1M portfolio and buy $100K protection via puts (5% OTM), your max loss is the put cost (premium)."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "What does 1-day 95% VaR of $100K mean?",
                            "options": [
                                {
                                    "text": "You expect losses exceeding $100K on about 1 in 20 trading days",
                                    "correct": true
                                },
                                {
                                    "text": "You will never lose more than $100K"
                                },
                                {
                                    "text": "Your portfolio gains 95% of the time"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "A call option has delta of 0.6. What does this mean?",
                            "options": [
                                {
                                    "text": "For each $1 the stock rises, the option gains $0.60",
                                    "correct": true
                                },
                                {
                                    "text": "The option costs 60 cents"
                                },
                                {
                                    "text": "The option expires in 60 days"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "compound",
                            "prompt": "How does positive theta (time decay) affect a short call position?",
                            "options": [
                                {
                                    "text": "It gains value daily as the option expires and loses value",
                                    "correct": true
                                },
                                {
                                    "text": "It loses money every day"
                                },
                                {
                                    "text": "It's unaffected by time decay"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "scale",
                            "prompt": "Price keeps bouncing at the dashed line. What is that level called?",
                            "options": [
                                {
                                    "text": "Resistance, a ceiling"
                                },
                                {
                                    "text": "Support, a floor where buyers keep stepping in",
                                    "correct": true
                                },
                                {
                                    "text": "The moving average"
                                }
                            ],
                            "why": "Support is a price where demand has repeatedly absorbed selling. Breaks below it are meaningful."
                        }
                    ]
                },
                {
                    "id": "advanced-6",
                    "track": "advanced",
                    "n": 6,
                    "title": "Algorithmic Trading & Systems",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "book",
                            "title": "Types of Algorithmic Strategies",
                            "text": "Momentum strategies ride trends: buy 52-week highs, short 52-week lows. Works in strong trends but reverses sharply."
                        },
                        {
                            "art": "compound",
                            "title": "Execution Algorithms: Minimizing Market Impact",
                            "text": "TWAP (Time-Weighted Average Price) slices large orders into equal pieces across time. VWAP (Volume-Weighted Average Price) executes proportional to hourly volume."
                        },
                        {
                            "art": "diversify",
                            "title": "Market Microstructure Basics",
                            "text": "Order books show best bid/ask and depth. Bid-ask spread (typically 1-5 cents per share) is transaction cost."
                        },
                        {
                            "art": "risk",
                            "title": "Building a Trading System Framework",
                            "text": "Core components: data feed (real-time prices), signal generation (buy/sell logic), position sizing, risk management (max loss per trade), order execution, and performance tracking."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "target",
                            "prompt": "What is the primary goal of VWAP and TWAP execution algorithms?",
                            "options": [
                                {
                                    "text": "Minimize market impact and slippage on large orders",
                                    "correct": true
                                },
                                {
                                    "text": "Execute orders as fast as possible"
                                },
                                {
                                    "text": "Maximize price improvement"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "market",
                            "prompt": "Why do most algorithmic trading strategies fail in live trading?",
                            "options": [
                                {
                                    "text": "Live markets are rigged against algos"
                                },
                                {
                                    "text": "Backtests ignore slippage, costs, and regime changes that erode edge quickly",
                                    "correct": true
                                },
                                {
                                    "text": "Exchanges block algorithmic trading"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "What makes arbitrage strategies more sustainable than momentum?",
                            "options": [
                                {
                                    "text": "Arbitrage returns are always higher"
                                },
                                {
                                    "text": "Arbitrage exploits structural pricing inefficiencies, not crowded trends",
                                    "correct": true
                                },
                                {
                                    "text": "Arbitrage never has any risk"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The green bars show volume. What does the tall bar during the breakout tell you?",
                            "options": [
                                {
                                    "text": "Nothing, volume is noise"
                                },
                                {
                                    "text": "Conviction, many participants confirmed the move",
                                    "correct": true
                                },
                                {
                                    "text": "The stock is about to split"
                                }
                            ],
                            "why": "Breakouts on heavy volume are far more reliable than moves on thin trading — volume is the fuel."
                        }
                    ]
                }
            ]
        },
        {
            "key": "master",
            "name": "Master",
            "color": [
                "#A98BD0",
                "#7B5FA6"
            ],
            "lessons": [
                {
                    "id": "master-1",
                    "track": "master",
                    "n": 1,
                    "title": "Economics: How Markets Set Prices",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "scale",
                            "title": "Supply, demand, and the price signal",
                            "text": "Every price you see is a negotiation between two curves. When more people want a thing than there is of it, price rises until enough buyers drop out; when supply floods in, price falls…"
                        },
                        {
                            "art": "book",
                            "title": "Incentives rule everything",
                            "text": "Economists assume people respond to incentives, and they're right often enough to bet on it. Tax something and you get less of it; subsidize it and you get more."
                        },
                        {
                            "art": "book",
                            "title": "Scarcity, trade-offs, and opportunity cost",
                            "text": "Economics is the study of scarcity: unlimited wants, limited stuff. Every choice therefore has an opportunity cost, the best alternative you gave up."
                        },
                        {
                            "art": "wallet",
                            "title": "Going deeper",
                            "text": "Each of these ideas compounds with the others: prices are signals, incentives drive behavior, and the cost of capital sets the bar every decision must clear."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "scale",
                            "prompt": "A rising price is best understood as…",
                            "options": [
                                {
                                    "text": "A moral failure of sellers"
                                },
                                {
                                    "text": "A signal telling producers to make more",
                                    "correct": true
                                },
                                {
                                    "text": "Proof of a bubble"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "scale",
                            "prompt": "Rent caps below market price typically cause…",
                            "options": [
                                {
                                    "text": "More apartments"
                                },
                                {
                                    "text": "Shortages of apartments",
                                    "correct": true
                                },
                                {
                                    "text": "No change"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Opportunity cost means…",
                            "options": [
                                {
                                    "text": "The sticker price of a choice"
                                },
                                {
                                    "text": "The value of the best alternative you gave up",
                                    "correct": true
                                },
                                {
                                    "text": "The broker fee"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "supply",
                            "prompt": "Supply and demand cross at the dot. What happens at that point?",
                            "options": [
                                {
                                    "text": "A shortage forms"
                                },
                                {
                                    "text": "The market clears, buyers and sellers agree on price",
                                    "correct": true
                                },
                                {
                                    "text": "The government sets the price"
                                }
                            ],
                            "why": "The intersection is equilibrium: the one price where quantity supplied equals quantity demanded."
                        }
                    ]
                },
                {
                    "id": "master-2",
                    "track": "master",
                    "n": 2,
                    "title": "Macroeconomics: GDP, Inflation & the Fed",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "clock",
                            "title": "GDP: the economy’s scoreboard",
                            "text": "Gross Domestic Product totals everything a country produces in a year. When GDP grows ~2-3%, the U."
                        },
                        {
                            "art": "wallet",
                            "title": "Inflation: the silent tax",
                            "text": "Inflation is the rate at which money loses purchasing power. At 3% a year, prices double roughly every 24 years; at 8%, every 9."
                        },
                        {
                            "art": "scale",
                            "title": "The Federal Reserve’s one big lever",
                            "text": "The Fed steers the economy mainly by setting the price of money, the federal funds rate. Cheap money spurs borrowing, hiring, and rising asset prices; expensive money cools all three."
                        },
                        {
                            "art": "wallet",
                            "title": "Going deeper",
                            "text": "Each of these ideas compounds with the others: prices are signals, incentives drive behavior, and the cost of capital sets the bar every decision must clear."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The informal definition of a recession is…",
                            "options": [
                                {
                                    "text": "One bad jobs report"
                                },
                                {
                                    "text": "Two consecutive quarters of shrinking GDP",
                                    "correct": true
                                },
                                {
                                    "text": "A 10% market drop"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "At 8% inflation, prices double roughly every…",
                            "options": [
                                {
                                    "text": "24 years"
                                },
                                {
                                    "text": "9 years",
                                    "correct": true
                                },
                                {
                                    "text": "50 years"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "clock",
                            "prompt": "When the Fed raises rates, borrowing generally becomes…",
                            "options": [
                                {
                                    "text": "Cheaper"
                                },
                                {
                                    "text": "More expensive",
                                    "correct": true
                                },
                                {
                                    "text": "Unchanged"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "scale",
                            "prompt": "The Fed hikes rates (amber arrow). What happens to the price of existing bonds?",
                            "options": [
                                {
                                    "text": "They rise together"
                                },
                                {
                                    "text": "They fall, old, lower coupons are worth less",
                                    "correct": true
                                },
                                {
                                    "text": "Nothing changes"
                                }
                            ],
                            "why": "The seesaw rule: nobody pays full price for a 3% bond when new ones pay 5%."
                        }
                    ]
                },
                {
                    "id": "master-3",
                    "track": "master",
                    "n": 3,
                    "title": "Microeconomics: Firms, Elasticity & Competition",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "scale",
                            "title": "Elasticity: who can raise prices",
                            "text": "Elasticity measures how much demand falls when price rises. Insulin, cigarettes, and iPhones are inelastic, buyers pay up."
                        },
                        {
                            "art": "market",
                            "title": "Market structures and profit",
                            "text": "Profits depend on competition. In perfect competition (wheat farmers), profits get squeezed to nearly nothing."
                        },
                        {
                            "art": "supply",
                            "title": "Marginal thinking",
                            "text": "Firms don't ask \"are we profitable? \"; they ask \"is the NEXT unit profitable?"
                        },
                        {
                            "art": "wallet",
                            "title": "Going deeper",
                            "text": "Each of these ideas compounds with the others: prices are signals, incentives drive behavior, and the cost of capital sets the bar every decision must clear."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "supply",
                            "prompt": "Inelastic demand means…",
                            "options": [
                                {
                                    "text": "Buyers keep buying even when prices rise",
                                    "correct": true
                                },
                                {
                                    "text": "Demand collapses on any price rise"
                                },
                                {
                                    "text": "Supply is fixed"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Which structure typically has the strongest pricing power?",
                            "options": [
                                {
                                    "text": "Perfect competition"
                                },
                                {
                                    "text": "A monopoly-like position",
                                    "correct": true
                                },
                                {
                                    "text": "Commodity farming"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Why do software companies have unusually high margins?",
                            "options": [
                                {
                                    "text": "Government subsidies"
                                },
                                {
                                    "text": "Near-zero marginal cost per additional user",
                                    "correct": true
                                },
                                {
                                    "text": "Cheap offices"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "bond",
                            "prompt": "The yield curve is sloping down (short rates above long). Historically this warns of…",
                            "options": [
                                {
                                    "text": "A boom"
                                },
                                {
                                    "text": "A possible recession ahead",
                                    "correct": true
                                },
                                {
                                    "text": "Higher stock dividends"
                                }
                            ],
                            "why": "An inverted curve means markets expect rate cuts — the classic, if imperfect, recession warning."
                        }
                    ]
                },
                {
                    "id": "master-4",
                    "track": "master",
                    "n": 4,
                    "title": "Real Estate Lending & Credit",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "book",
                            "title": "How a mortgage actually works",
                            "text": "A mortgage is amortized: each payment is part interest, part principal, and early on it's nearly all interest."
                        },
                        {
                            "art": "bond",
                            "title": "Credit scores and the price of trust",
                            "text": "A credit score is the market's estimate of whether you repay. The gap is expensive: a 760 borrower might get 6."
                        },
                        {
                            "art": "clock",
                            "title": "2008: when lending standards died",
                            "text": "The financial crisis was a lending story. \"Subprime\" mortgages went to borrowers who couldn't repay, were bundled into securities rated AAA, and sold worldwide."
                        },
                        {
                            "art": "wallet",
                            "title": "Going deeper",
                            "text": "Each of these ideas compounds with the others: prices are signals, incentives drive behavior, and the cost of capital sets the bar every decision must clear."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Early mortgage payments are mostly…",
                            "options": [
                                {
                                    "text": "Principal"
                                },
                                {
                                    "text": "Interest",
                                    "correct": true
                                },
                                {
                                    "text": "Property tax"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "LTV measures…",
                            "options": [
                                {
                                    "text": "Loan size versus the property’s value",
                                    "correct": true
                                },
                                {
                                    "text": "Monthly payment versus income"
                                },
                                {
                                    "text": "Interest versus principal"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The core cause of the 2008 crisis was…",
                            "options": [
                                {
                                    "text": "A stock market computer glitch"
                                },
                                {
                                    "text": "Collapsing lending standards packaged into AAA securities",
                                    "correct": true
                                },
                                {
                                    "text": "Oil prices"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The classic 50/30/20 budget. What does the green slice do?",
                            "options": [
                                {
                                    "text": "Rent and groceries"
                                },
                                {
                                    "text": "Entertainment"
                                },
                                {
                                    "text": "Saving and investing, it buys your future",
                                    "correct": true
                                }
                            ],
                            "why": "The 20% is the wealth-building slice: emergency fund, retirement accounts, and investments."
                        }
                    ]
                },
                {
                    "id": "master-5",
                    "track": "master",
                    "n": 5,
                    "title": "Corporate Finance & How Companies Raise Money",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "risk",
                            "title": "Debt versus equity",
                            "text": "Companies fund themselves two ways: borrow (debt) or sell ownership (equity). Debt is cheaper, interest is tax-deductible and lenders take less risk, but it must be repaid on schedule, and…"
                        },
                        {
                            "art": "compound",
                            "title": "IPOs, secondaries, and dilution",
                            "text": "An IPO sells shares to the public for the first time, the company gets cash, insiders get an exit, and you get a ticker."
                        },
                        {
                            "art": "wallet",
                            "title": "WACC and the hurdle every project must clear",
                            "text": "A company's weighted average cost of capital blends what it pays lenders and what shareholders expect."
                        },
                        {
                            "art": "wallet",
                            "title": "Going deeper",
                            "text": "Each of these ideas compounds with the others: prices are signals, incentives drive behavior, and the cost of capital sets the bar every decision must clear."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Why is debt usually cheaper than equity?",
                            "options": [
                                {
                                    "text": "Interest is tax-deductible and lenders bear less risk",
                                    "correct": true
                                },
                                {
                                    "text": "Banks are generous"
                                },
                                {
                                    "text": "Equity pays interest too"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "A secondary offering typically…",
                            "options": [
                                {
                                    "text": "Buys back shares"
                                },
                                {
                                    "text": "Dilutes existing shareholders by issuing new shares",
                                    "correct": true
                                },
                                {
                                    "text": "Pays a special dividend"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "clock",
                            "prompt": "A project creates value when its return is…",
                            "options": [
                                {
                                    "text": "Positive"
                                },
                                {
                                    "text": "Above the company’s cost of capital",
                                    "correct": true
                                },
                                {
                                    "text": "Higher than last year’s"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "supply",
                            "prompt": "Supply and demand cross at the dot. What happens at that point?",
                            "options": [
                                {
                                    "text": "A shortage forms"
                                },
                                {
                                    "text": "The market clears, buyers and sellers agree on price",
                                    "correct": true
                                },
                                {
                                    "text": "The government sets the price"
                                }
                            ],
                            "why": "The intersection is equilibrium: the one price where quantity supplied equals quantity demanded."
                        }
                    ]
                },
                {
                    "id": "master-6",
                    "track": "master",
                    "n": 6,
                    "title": "Personal Finance: Taxes, Accounts & Compounding for You",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "market",
                            "title": "The order of operations for your money",
                            "text": "Wealth-building has a boring, correct sequence: build a small emergency fund, capture any employer 401(k) match (an instant 100% return), kill high-interest debt (a guaranteed 25% \"return\"…"
                        },
                        {
                            "art": "wallet",
                            "title": "Tax-advantaged accounts are free money",
                            "text": "A Roth IRA grows and withdraws tax-free forever; a traditional 401(k) defers taxes until retirement."
                        },
                        {
                            "art": "compound",
                            "title": "Capital gains and why holding wins twice",
                            "text": "Sell a winner within a year and the profit is taxed as ordinary income, up to 37%. Hold past one year and the long-term rate drops to 0-20%."
                        },
                        {
                            "art": "wallet",
                            "title": "Going deeper",
                            "text": "Each of these ideas compounds with the others: prices are signals, incentives drive behavior, and the cost of capital sets the bar every decision must clear."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "An employer 401(k) match is effectively…",
                            "options": [
                                {
                                    "text": "A loan"
                                },
                                {
                                    "text": "An instant 100% return on the matched amount",
                                    "correct": true
                                },
                                {
                                    "text": "A tax"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "A Roth IRA’s superpower is…",
                            "options": [
                                {
                                    "text": "Unlimited contributions"
                                },
                                {
                                    "text": "Tax-free growth and withdrawals",
                                    "correct": true
                                },
                                {
                                    "text": "Guaranteed returns"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Holding an investment past one year usually…",
                            "options": [
                                {
                                    "text": "Raises your tax rate"
                                },
                                {
                                    "text": "Lowers the tax rate on gains",
                                    "correct": true
                                },
                                {
                                    "text": "Has no tax effect"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "scale",
                            "prompt": "The Fed hikes rates (amber arrow). What happens to the price of existing bonds?",
                            "options": [
                                {
                                    "text": "They rise together"
                                },
                                {
                                    "text": "They fall, old, lower coupons are worth less",
                                    "correct": true
                                },
                                {
                                    "text": "Nothing changes"
                                }
                            ],
                            "why": "The seesaw rule: nobody pays full price for a 3% bond when new ones pay 5%."
                        }
                    ]
                }
            ]
        },
        {
            "key": "investing",
            "name": "Investing",
            "color": [
                "#9DB8D2",
                "#5C7691"
            ],
            "lessons": [
                {
                    "id": "investing-1",
                    "track": "investing",
                    "n": 1,
                    "title": "Why Long-Term Investing Works",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "clock",
                            "title": "The power of compounding",
                            "text": "Compounding is what happens when your returns start earning returns of their own. Invest $10,000 at 8% and you earn $800 in year one, but in year two you earn 8% on $10,800, and so on."
                        },
                        {
                            "art": "compound",
                            "title": "Time in the market beats timing the market",
                            "text": "It feels smart to wait for a crash before buying, but the data is brutal on market timers. Missing just the 10 best days in the S&P 500 over a 20-year stretch roughly cuts your total return…"
                        },
                        {
                            "art": "compound",
                            "title": "Your real enemies: fees, taxes, and panic",
                            "text": "Long-term returns get eaten by three quiet forces. A 1% annual fee sounds tiny but consumes roughly a quarter of your wealth over 30 years."
                        },
                        {
                            "art": "compound",
                            "title": "Going deeper",
                            "text": "Time in the market also changes your tax bill and your behavior. Long-term capital gains are taxed at far lower rates than short-term trades, and an investor who plans in decades stops…"
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "What makes compounding so powerful over long periods?",
                            "options": [
                                {
                                    "text": "Returns are guaranteed by the government"
                                },
                                {
                                    "text": "Your returns begin earning returns of their own",
                                    "correct": true
                                },
                                {
                                    "text": "Stocks only go up in the long run"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "market",
                            "prompt": "What happens if you miss the 10 best market days over 20 years?",
                            "options": [
                                {
                                    "text": "Almost nothing. 10 days is trivial"
                                },
                                {
                                    "text": "Your total return is roughly cut in half",
                                    "correct": true
                                },
                                {
                                    "text": "You avoid the 10 worst days automatically"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "compound",
                            "prompt": "Which is a real threat to long-term returns?",
                            "options": [
                                {
                                    "text": "High annual fees",
                                    "correct": true
                                },
                                {
                                    "text": "Market holidays"
                                },
                                {
                                    "text": "Dividend payments"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "candles",
                            "prompt": "The chart shows $100 saved flat vs. invested at 8%. Which line is compounding?",
                            "options": [
                                {
                                    "text": "Line A, steady and straight"
                                },
                                {
                                    "text": "Line B, it accelerates as gains earn gains",
                                    "correct": true
                                },
                                {
                                    "text": "Neither, both are linear"
                                }
                            ],
                            "why": "Compound growth curves upward because each year of gains earns its own gains."
                        }
                    ]
                },
                {
                    "id": "investing-2",
                    "track": "investing",
                    "n": 2,
                    "title": "Index Funds & Diversification",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "diversify",
                            "title": "Owning everything at once",
                            "text": "An index fund buys every company in a market index, the S&P 500 fund holds all 500 firms in one share."
                        },
                        {
                            "art": "diversify",
                            "title": "Why diversification is the only free lunch",
                            "text": "Any single company can go to zero, even giants like Enron, Lehman Brothers, and Kodak did. A basket of 500 cannot go to zero without the entire economy collapsing."
                        },
                        {
                            "art": "diversify",
                            "title": "Costs and dollar-cost averaging",
                            "text": "Two habits complete the system. First, watch the expense ratio, index funds charge as little as 0."
                        },
                        {
                            "art": "diversify",
                            "title": "Going deeper",
                            "text": "The math behind indexing is brutal and simple: the market's return is the average of all investors' returns, so after fees the average active investor MUST underperform the index."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "diversify",
                            "prompt": "What does an S&P 500 index fund actually hold?",
                            "options": [
                                {
                                    "text": "The 500 fastest-growing tech startups"
                                },
                                {
                                    "text": "All 500 companies in the index",
                                    "correct": true
                                },
                                {
                                    "text": "A rotating selection picked by managers"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Why is diversification called a \"free lunch\"?",
                            "options": [
                                {
                                    "text": "It eliminates single-company disaster risk without lowering expected returns",
                                    "correct": true
                                },
                                {
                                    "text": "It guarantees profits every year"
                                },
                                {
                                    "text": "Funds provide free meals to shareholders"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "What does dollar-cost averaging do?",
                            "options": [
                                {
                                    "text": "Times the market bottom precisely"
                                },
                                {
                                    "text": "Buys more shares when prices are low and fewer when high, automatically",
                                    "correct": true
                                },
                                {
                                    "text": "Averages the fees across brokers"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "wallet",
                            "prompt": "Two portfolios, same total money. Which is more diversified?",
                            "options": [
                                {
                                    "text": "Portfolio A, conviction in one stock"
                                },
                                {
                                    "text": "Portfolio B, spread across five holdings",
                                    "correct": true
                                },
                                {
                                    "text": "They carry identical risk"
                                }
                            ],
                            "why": "One bad earnings call can sink Portfolio A; no single mistake can sink Portfolio B."
                        }
                    ]
                },
                {
                    "id": "investing-3",
                    "track": "investing",
                    "n": 3,
                    "title": "Setting Goals & Knowing Your Risk Tolerance",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "market",
                            "title": "Money needs a job description",
                            "text": "Before buying anything, name what the money is for and when you need it. A house down payment in 3 years cannot ride the stock market's swings; retirement money in 2055 absolutely should."
                        },
                        {
                            "art": "risk",
                            "title": "Risk tolerance is discovered, not declared",
                            "text": "Everyone is aggressive in a bull market. Your true risk tolerance is how you behaved the last time your account fell 20%, did you buy, hold, or panic-sell?"
                        },
                        {
                            "art": "wallet",
                            "title": "The emergency fund comes first",
                            "text": "Three to six months of expenses in cash is not dead money, it is what prevents forced selling. Investors without a cash buffer end up liquidating stocks at the bottom to fix a transmission…"
                        },
                        {
                            "art": "risk",
                            "title": "Going deeper",
                            "text": "A useful exercise is writing an investment policy statement, one page stating what the money is for, when you need it, your target allocation, and what you will do in a 30% drawdown…"
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "wallet",
                            "prompt": "Money needed within ~3 years belongs mostly in…",
                            "options": [
                                {
                                    "text": "Growth stocks"
                                },
                                {
                                    "text": "Safe, stable assets",
                                    "correct": true
                                },
                                {
                                    "text": "Crypto"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "risk",
                            "prompt": "Your real risk tolerance is best revealed by…",
                            "options": [
                                {
                                    "text": "A questionnaire"
                                },
                                {
                                    "text": "How you acted in the last 20% drop",
                                    "correct": true
                                },
                                {
                                    "text": "Your salary"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "wallet",
                            "prompt": "The emergency fund exists mainly to…",
                            "options": [
                                {
                                    "text": "Earn high returns"
                                },
                                {
                                    "text": "Prevent forced selling during emergencies",
                                    "correct": true
                                },
                                {
                                    "text": "Pay taxes"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "scale",
                            "prompt": "Both companies earn $5 per share. Which is the cheaper price for each dollar of earnings?",
                            "options": [
                                {
                                    "text": "Stock A, you pay $12 per $1 of earnings",
                                    "correct": true
                                },
                                {
                                    "text": "Stock B, a higher bar is better"
                                },
                                {
                                    "text": "Impossible to compare"
                                }
                            ],
                            "why": "P/E is the price of a dollar of earnings. Lower is cheaper — B is only worth it if it grows much faster."
                        }
                    ]
                },
                {
                    "id": "investing-4",
                    "track": "investing",
                    "n": 4,
                    "title": "Retirement Accounts & the Free Money",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "book",
                            "title": "The 401(k) match is a 100% return",
                            "text": "If your employer matches contributions, every dollar you put in up to the match instantly doubles."
                        },
                        {
                            "art": "book",
                            "title": "Roth vs. Traditional in one paragraph",
                            "text": "Traditional accounts deduct taxes now and tax withdrawals later; Roth accounts tax you now and never again."
                        },
                        {
                            "art": "wallet",
                            "title": "The quiet cost of cashing out",
                            "text": "Withdrawing retirement money early usually triggers taxes plus a 10% penalty, and worse, it amputates decades of compounding."
                        },
                        {
                            "art": "market",
                            "title": "Going deeper",
                            "text": "Order of operations matters more than fund selection here: capture the full employer match first, then max an IRA (Roth if you're early-career), then return to the 401(k)."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "An employer match is effectively…",
                            "options": [
                                {
                                    "text": "A loan"
                                },
                                {
                                    "text": "An instant 100% return",
                                    "correct": true
                                },
                                {
                                    "text": "A gimmick"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "A Roth account means…",
                            "options": [
                                {
                                    "text": "Tax break now, taxed later"
                                },
                                {
                                    "text": "Taxed now, tax-free forever after",
                                    "correct": true
                                },
                                {
                                    "text": "No taxes ever"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Cashing out a 401(k) early usually costs…",
                            "options": [
                                {
                                    "text": "Nothing"
                                },
                                {
                                    "text": "Taxes plus a 10% penalty plus lost compounding",
                                    "correct": true
                                },
                                {
                                    "text": "A small paperwork fee"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "This position fell 50%. What gain does it now need just to get back to even?",
                            "options": [
                                {
                                    "text": "50%, the same amount back"
                                },
                                {
                                    "text": "100%, it must double from $50",
                                    "correct": true
                                },
                                {
                                    "text": "25%, losses recover faster"
                                }
                            ],
                            "why": "Losses are asymmetric: from $50 back to $100 is a +100% climb. This is why risk control beats heroics."
                        }
                    ]
                },
                {
                    "id": "investing-5",
                    "track": "investing",
                    "n": 5,
                    "title": "Bonds & Fixed Income Basics",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "bond",
                            "title": "A bond is a loan with a schedule",
                            "text": "Buy a bond and you are the lender: the issuer pays fixed interest (the coupon) and returns your principal at maturity."
                        },
                        {
                            "art": "bond",
                            "title": "The seesaw: rates up, prices down",
                            "text": "Bond prices move opposite to interest rates. If you hold a 3% bond and new bonds pay 5%, nobody wants yours at full price, it must sell at a discount."
                        },
                        {
                            "art": "book",
                            "title": "What bonds are for",
                            "text": "Bonds rarely make you rich; they keep you invested. Their job is ballast, dampening crashes so you never sell stocks at the bottom."
                        },
                        {
                            "art": "bond",
                            "title": "Going deeper",
                            "text": "Two numbers summarize any bond fund: duration and credit quality. Duration approximates how much the fund falls if rates rise 1%, a duration of 6 means roughly a 6% drop."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "bond",
                            "prompt": "A bond is essentially…",
                            "options": [
                                {
                                    "text": "Company ownership"
                                },
                                {
                                    "text": "A loan you make in exchange for interest",
                                    "correct": true
                                },
                                {
                                    "text": "A savings account"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "bond",
                            "prompt": "When interest rates rise, existing bond prices…",
                            "options": [
                                {
                                    "text": "Rise"
                                },
                                {
                                    "text": "Fall",
                                    "correct": true
                                },
                                {
                                    "text": "Stay fixed"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "diversify",
                            "prompt": "The main job of bonds in a portfolio is…",
                            "options": [
                                {
                                    "text": "Maximum growth"
                                },
                                {
                                    "text": "Stability that keeps you invested",
                                    "correct": true
                                },
                                {
                                    "text": "Tax evasion"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "candles",
                            "prompt": "The chart shows $100 saved flat vs. invested at 8%. Which line is compounding?",
                            "options": [
                                {
                                    "text": "Line A, steady and straight"
                                },
                                {
                                    "text": "Line B, it accelerates as gains earn gains",
                                    "correct": true
                                },
                                {
                                    "text": "Neither, both are linear"
                                }
                            ],
                            "why": "Compound growth curves upward because each year of gains earns its own gains."
                        }
                    ]
                },
                {
                    "id": "investing-6",
                    "track": "investing",
                    "n": 6,
                    "title": "Behavioral Traps Every New Investor Falls Into",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "wallet",
                            "title": "Chasing what already went up",
                            "text": "Performance chasing is buying last year's winner right before it becomes this year's loser. Funds and stocks that topped the charts attract floods of money at exactly the wrong moment."
                        },
                        {
                            "art": "risk",
                            "title": "Loss aversion and the refusal to sell",
                            "text": "Losses hurt about twice as much as gains feel good, so investors hold losers hoping to \"get back to even\", anchoring to a price the market has forgotten."
                        },
                        {
                            "art": "compound",
                            "title": "Checking the account every day",
                            "text": "The more often you look, the more losses you see: daily, stocks are down almost half the time; over 20-year windows, they have essentially never been."
                        },
                        {
                            "art": "warning",
                            "title": "Going deeper",
                            "text": "The most expensive bias may be action bias, the feeling that responding to news requires a trade."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Performance chasing means…",
                            "options": [
                                {
                                    "text": "Buying assets after big runs, near their peak",
                                    "correct": true
                                },
                                {
                                    "text": "Rebalancing yearly"
                                },
                                {
                                    "text": "Buying quality cheap"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "\"Waiting to get back to even\" is…",
                            "options": [
                                {
                                    "text": "Sound strategy"
                                },
                                {
                                    "text": "Anchoring, an emotional bias",
                                    "correct": true
                                },
                                {
                                    "text": "Required by brokers"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "diversify",
                            "prompt": "Checking your portfolio daily mostly produces…",
                            "options": [
                                {
                                    "text": "Better decisions"
                                },
                                {
                                    "text": "More perceived losses and more harmful tinkering",
                                    "correct": true
                                },
                                {
                                    "text": "Higher returns"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "wallet",
                            "prompt": "Two portfolios, same total money. Which is more diversified?",
                            "options": [
                                {
                                    "text": "Portfolio A, conviction in one stock"
                                },
                                {
                                    "text": "Portfolio B, spread across five holdings",
                                    "correct": true
                                },
                                {
                                    "text": "They carry identical risk"
                                }
                            ],
                            "why": "One bad earnings call can sink Portfolio A; no single mistake can sink Portfolio B."
                        }
                    ]
                },
                {
                    "id": "investing-7",
                    "track": "investing",
                    "n": 7,
                    "title": "Reading Financial Statements",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "book",
                            "title": "Three documents, one story",
                            "text": "Every public company files three statements each quarter, and each answers a different question."
                        },
                        {
                            "art": "balance",
                            "title": "The balance sheet: where companies die",
                            "text": "Companies rarely die from a bad quarter; they die from balance sheets, too much debt meeting a bad year."
                        },
                        {
                            "art": "dividend",
                            "title": "Cash flow: the lie detector",
                            "text": "Net income involves estimates, when to recognize revenue, how fast things depreciate. Cash doesn't."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "dividend",
                            "prompt": "Revenue $800M, COGS $480M, operating expenses $200M. Operating income is…",
                            "options": [
                                {
                                    "text": "$320M"
                                },
                                {
                                    "text": "$120M",
                                    "correct": true
                                },
                                {
                                    "text": "$600M"
                                }
                            ],
                            "why": "Gross profit 320 − opex 200 = $120M operating income."
                        },
                        {
                            "type": "choice",
                            "art": "dividend",
                            "prompt": "A company grows reported profits 20%/yr for three years while operating cash flow stays flat. This most likely signals…",
                            "options": [
                                {
                                    "text": "excellent management"
                                },
                                {
                                    "text": "aggressive accounting, the profits aren't converting to cash",
                                    "correct": true
                                },
                                {
                                    "text": "a tax holiday"
                                }
                            ],
                            "why": "Persistent profit/cash divergence is the classic pre-blowup pattern (see: Enron)."
                        },
                        {
                            "type": "choice",
                            "art": "dividend",
                            "prompt": "Operating income $60M, interest expense $25M. Interest coverage is…",
                            "options": [
                                {
                                    "text": "2.4×, uncomfortably thin",
                                    "correct": true
                                },
                                {
                                    "text": "0.4×"
                                },
                                {
                                    "text": "85×"
                                }
                            ],
                            "why": "60/25 = 2.4×, below the ~3× comfort line. One bad year threatens solvency."
                        },
                        {
                            "type": "choice",
                            "art": "dividend",
                            "prompt": "Free cash flow equals…",
                            "options": [
                                {
                                    "text": "net income + dividends"
                                },
                                {
                                    "text": "operating cash flow − capital expenditures",
                                    "correct": true
                                },
                                {
                                    "text": "revenue − all expenses"
                                }
                            ],
                            "why": "FCF is the cash actually available to owners after keeping the machines running."
                        }
                    ]
                },
                {
                    "id": "investing-8",
                    "track": "investing",
                    "n": 8,
                    "title": "Valuation: What a Company Is Worth",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "scale",
                            "title": "Price is a vote; value is a weighing",
                            "text": "A stock at $400 isn't \"expensive\" and a stock at $4 isn't \"cheap\", price alone means nothing until divided by something the business produces."
                        },
                        {
                            "art": "compound",
                            "title": "Multiples are comparisons, not verdicts",
                            "text": "Every multiple answers one question: compared to what? Compare to the company's own history (Microsoft at 35× vs its own decade average of 28× is a statement); to peers (a railroad at 22×…"
                        },
                        {
                            "art": "scale",
                            "title": "Reverse-engineering expectations",
                            "text": "The most powerful intermediate technique costs one minute: invert the multiple into a forecast."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "bond",
                            "prompt": "A stock trades at $90 with $6 of earnings per share. Its P/E and earnings yield are…",
                            "options": [
                                {
                                    "text": "15× and 6.7%",
                                    "correct": true
                                },
                                {
                                    "text": "6.7× and 15%"
                                },
                                {
                                    "text": "540× and 0.2%"
                                }
                            ],
                            "why": "90/6 = 15×; invert for 6/90 = 6.7% earnings yield."
                        },
                        {
                            "type": "choice",
                            "art": "scale",
                            "prompt": "EV/EBITDA improves on P/E chiefly because…",
                            "options": [
                                {
                                    "text": "EBITDA is always honest"
                                },
                                {
                                    "text": "it includes debt in the price, so leverage can't fake cheapness",
                                    "correct": true
                                },
                                {
                                    "text": "it's newer"
                                }
                            ],
                            "why": "Enterprise value = market cap + net debt: the price of the WHOLE business, not just the equity sliver."
                        },
                        {
                            "type": "choice",
                            "art": "scale",
                            "prompt": "A stock at P/E 50 growing earnings 12%/yr has a PEG of about…",
                            "options": [
                                {
                                    "text": "0.6"
                                },
                                {
                                    "text": "4.2, priced for far more growth than forecast",
                                    "correct": true
                                },
                                {
                                    "text": "1.0"
                                }
                            ],
                            "why": "50 ÷ 12 ≈ 4.2. Either growth accelerates dramatically or the multiple compresses."
                        },
                        {
                            "type": "choice",
                            "art": "scale",
                            "prompt": "When Treasury yields rise from 1% to 5%, high-P/E stocks typically fall hardest because…",
                            "options": [
                                {
                                    "text": "their earnings yield now competes badly with risk-free bonds and their distant profits are discounted harder",
                                    "correct": true
                                },
                                {
                                    "text": "they have more debt"
                                },
                                {
                                    "text": "index funds sell them first"
                                }
                            ],
                            "why": "A 2% earnings yield vs 5% risk-free is a tough sell; long-duration cash flows reprice most."
                        }
                    ]
                },
                {
                    "id": "investing-9",
                    "track": "investing",
                    "n": 9,
                    "title": "Growth vs. Value Investing",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "risk",
                            "title": "Two tribes, one arithmetic",
                            "text": "Value investing buys businesses for less than a conservative estimate of what they're worth. Graham's \"margin of safety,\" Buffett's cigar butts upgraded to…"
                        },
                        {
                            "art": "growth",
                            "title": "Where each style fails",
                            "text": "Value's failure mode is the value trap : statistically cheap, actually dying. Sears at 8× earnings, newspapers at 5×, Blockbuster at 4×, each looked like a bargain against yesterday's…"
                        },
                        {
                            "art": "scale",
                            "title": "The synthesis grown-ups reach",
                            "text": "Most great records converge to the same place from opposite doors: quality at a reasonable price ."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The core claim of value investing is that…",
                            "options": [
                                {
                                    "text": "cheap stocks always outperform"
                                },
                                {
                                    "text": "markets overreact, letting you buy assets below conservative intrinsic value",
                                    "correct": true
                                },
                                {
                                    "text": "dividends are all that matter"
                                }
                            ],
                            "why": "Margin of safety: pay 60 cents for a defensible dollar and let reversion work."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "A value trap is…",
                            "options": [
                                {
                                    "text": "a statistically cheap stock whose business is genuinely deteriorating",
                                    "correct": true
                                },
                                {
                                    "text": "any stock under 10× earnings"
                                },
                                {
                                    "text": "a short seller's position"
                                }
                            ],
                            "why": "The multiple is low against earnings that are about to vanish. Cheapness was the bait."
                        },
                        {
                            "type": "choice",
                            "art": "scale",
                            "prompt": "A stock at 45× earnings grows EPS 14%/yr for five years, but its multiple normalizes to 22×. The return is roughly…",
                            "options": [
                                {
                                    "text": "+14%/yr"
                                },
                                {
                                    "text": "about −1%/yr, flat to negative despite great execution",
                                    "correct": true
                                },
                                {
                                    "text": "+45%"
                                }
                            ],
                            "why": "EPS ×1.93, multiple ×0.49 → price ×0.94. Multiple compression ate the entire growth."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The 2010s vs 2022 style reversal mostly tracked…",
                            "options": [
                                {
                                    "text": "interest rates: cheap money favors distant profits; rising rates favor cash now",
                                    "correct": true
                                },
                                {
                                    "text": "the alphabet"
                                },
                                {
                                    "text": "index fund flows only"
                                }
                            ],
                            "why": "Zero rates made growth's far-future cash flows cheap to hold; 5% rates repriced them brutally."
                        }
                    ]
                },
                {
                    "id": "investing-10",
                    "track": "investing",
                    "n": 10,
                    "title": "Moats: Durable Competitive Advantage",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "book",
                            "title": "Why great businesses stay great",
                            "text": "Capitalism's default setting is erosion: any business earning fat profits attracts competitors until the profits are ordinary."
                        },
                        {
                            "art": "growth",
                            "title": "The proof is ROIC, not the story",
                            "text": "Every annual report claims a moat; arithmetic settles it. Return on invested capital , after-tax operating profit ÷ (debt + equity capital employed), measures what the business earns on the…"
                        },
                        {
                            "art": "book",
                            "title": "Moats die, watch the drawbridge",
                            "text": "Kodak had the century's best brand moat; digital didn't care. Newspapers owned local-ad monopolies; Craigslist ate them in five years."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The strongest evidence a moat actually exists is…",
                            "options": [
                                {
                                    "text": "a famous brand"
                                },
                                {
                                    "text": "ROIC held well above the cost of capital for a decade through stress",
                                    "correct": true
                                },
                                {
                                    "text": "rapid revenue growth"
                                }
                            ],
                            "why": "Stories claim moats; a decade of superior returns on capital proves competitors tried and failed."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Visa's primary moat source is…",
                            "options": [
                                {
                                    "text": "network effects, more merchants make cards more valuable and vice versa",
                                    "correct": true
                                },
                                {
                                    "text": "patents"
                                },
                                {
                                    "text": "cheap fees"
                                }
                            ],
                            "why": "Two-sided network loops are near-impossible to bootstrap against."
                        },
                        {
                            "type": "choice",
                            "art": "compound",
                            "prompt": "A company reinvests $2B at 6% ROIC while its cost of capital is 9%. This growth…",
                            "options": [
                                {
                                    "text": "creates value, growth is always good"
                                },
                                {
                                    "text": "destroys roughly $60M of value per year",
                                    "correct": true
                                },
                                {
                                    "text": "is neutral"
                                }
                            ],
                            "why": "Earning 6% on capital that costs 9% loses 3 points on every reinvested dollar. Empire-building, not compounding."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The classic sign a moat is being harvested rather than widened is…",
                            "options": [
                                {
                                    "text": "heavy R&D spending"
                                },
                                {
                                    "text": "price hikes + R&D cuts + flat innovation while margins temporarily bloom",
                                    "correct": true
                                },
                                {
                                    "text": "a stock split"
                                }
                            ],
                            "why": "Harvesting inflates today's numbers by spending the future — margins peak right before the erosion shows."
                        }
                    ]
                },
                {
                    "id": "investing-11",
                    "track": "investing",
                    "n": 11,
                    "title": "Position Sizing & Rebalancing Discipline",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "book",
                            "title": "The decision nobody researches",
                            "text": "Investors agonize over WHAT to buy and improvise HOW MUCH, exactly backwards, because sizing is the decision that determines survival."
                        },
                        {
                            "art": "book",
                            "title": "Let winners run vs. concentration creep",
                            "text": "Buy a 4% position that quadruples and you now own a 14% position, congratulations and beware. \"Let winners run\" and \"trim to size\" are both defensible; the professional compromise is a…"
                        },
                        {
                            "art": "diversify",
                            "title": "Rebalancing: the machine that buys low",
                            "text": "Portfolio drift is silent: a 60/40 left alone through the 2010s drifted to roughly 80/20, maximum equity risk arrived precisely at maximum valuations."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Roughly what share of U.S. stocks since 1980 suffered a 70%+ permanent decline?",
                            "options": [
                                {
                                    "text": "~5%"
                                },
                                {
                                    "text": "~40%",
                                    "correct": true
                                },
                                {
                                    "text": "~90%"
                                }
                            ],
                            "why": "Catastrophic single-stock loss is the NORM, not the exception — the market's return comes from a winning minority. Hence sizing."
                        },
                        {
                            "type": "choice",
                            "art": "diversify",
                            "prompt": "Your 4% position grows into 15% of the portfolio. The disciplined move under a 2× band is…",
                            "options": [
                                {
                                    "text": "sell everything immediately"
                                },
                                {
                                    "text": "trim back toward target and redeploy",
                                    "correct": true
                                },
                                {
                                    "text": "add more, it's working"
                                }
                            ],
                            "why": "The band was set in advance precisely so this decision wouldn't be made by adrenaline."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Holding heavy employer stock is uniquely risky because…",
                            "options": [
                                {
                                    "text": "it's illegal"
                                },
                                {
                                    "text": "your income and your portfolio then fail together",
                                    "correct": true
                                },
                                {
                                    "text": "employers underperform"
                                }
                            ],
                            "why": "Same-entity risk: Enron employees lost jobs and 401(k)s in the same month."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The main documented benefit of mechanical rebalancing is…",
                            "options": [
                                {
                                    "text": "huge extra returns"
                                },
                                {
                                    "text": "risk control and forced buy-low/sell-high without requiring courage",
                                    "correct": true
                                },
                                {
                                    "text": "lower taxes always"
                                }
                            ],
                            "why": "The return bonus is modest; the behavioral and risk payoff is the product."
                        }
                    ]
                },
                {
                    "id": "investing-12",
                    "track": "investing",
                    "n": 12,
                    "title": "Economic Cycles & Sector Rotation",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "book",
                            "title": "The economy breathes",
                            "text": "Expansion, peak, contraction, recovery, the business cycle has repeated a dozen times since WWII, averaging five to seven years, and each phase reliably favors different corners of the…"
                        },
                        {
                            "art": "bond",
                            "title": "Signals worth respecting (and their failure rate)",
                            "text": "The yield curve : when 10-year Treasury yields fall below 2-year yields (inversion), recession has followed within ~6-24 months for nearly every case in 60 years, though 2022's inversion…"
                        },
                        {
                            "art": "compound",
                            "title": "Using cycles without becoming a forecaster",
                            "text": "The evidence-based middle path: tilt, don't time . Keep the diversified core untouched; if you act on cycle reads at all, shade 5-10% toward favored sectors, never flip the whole book."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Stocks typically bottom…",
                            "options": [
                                {
                                    "text": "after the recession officially ends"
                                },
                                {
                                    "text": "mid-recession, while news is darkest",
                                    "correct": true
                                },
                                {
                                    "text": "the day GDP turns positive"
                                }
                            ],
                            "why": "Markets price the future 6-12 months out: March 2009 and March 2020 bottoms arrived amid the worst headlines."
                        },
                        {
                            "type": "choice",
                            "art": "bond",
                            "prompt": "A 10yr/2yr yield-curve inversion historically signals…",
                            "options": [
                                {
                                    "text": "guaranteed crash within a month"
                                },
                                {
                                    "text": "elevated recession odds in the following ~6-24 months",
                                    "correct": true
                                },
                                {
                                    "text": "nothing at all"
                                }
                            ],
                            "why": "Nearly every post-1960 recession was preceded by inversion — with long, variable, trade-unfriendly lags."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Which set is the classic RECESSION shelter?",
                            "options": [
                                {
                                    "text": "energy, materials, small caps"
                                },
                                {
                                    "text": "staples, utilities, healthcare",
                                    "correct": true
                                },
                                {
                                    "text": "banks and airlines"
                                }
                            ],
                            "why": "Demand for food, power and medicine doesn't track GDP."
                        },
                        {
                            "type": "choice",
                            "art": "compound",
                            "prompt": "\"Tilt, don't time\" means…",
                            "options": [
                                {
                                    "text": "shade 5-10% toward cycle views while the diversified core stays put",
                                    "correct": true
                                },
                                {
                                    "text": "sell everything at the peak"
                                },
                                {
                                    "text": "only buy tilted charts"
                                }
                            ],
                            "why": "Small expressed views cap the damage of wrong macro calls — which are the majority of macro calls."
                        }
                    ]
                },
                {
                    "id": "investing-13",
                    "track": "investing",
                    "n": 13,
                    "title": "Capital Allocation: Dividends, Buybacks & ROIC",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "wallet",
                            "title": "The CEO's real job",
                            "text": "A mature company generates a river of free cash, and every dollar must go through one of five doors: reinvest in the business, acquire, buy back stock, pay dividends, or repay debt."
                        },
                        {
                            "art": "scale",
                            "title": "Buyback math, without the ideology",
                            "text": "Buybacks are neither the fraud critics claim nor the gift promoters claim, they are simply an investment in your own stock , exactly as good as the price paid."
                        },
                        {
                            "art": "bond",
                            "title": "Dividend quality, measured like a bond",
                            "text": "A dividend is a promise attached to no contract, so underwrite it like a creditor. FCF payout ratio (dividends ÷ free cash flow."
                        },
                        {
                            "art": "balance",
                            "title": "Reading management like a capital allocator",
                            "text": "The disclosure diet: read the last five years of shareholder letters and count how often capital allocation is discussed with numbers versus adjectives."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "wallet",
                            "prompt": "A company earns 22% ROIC with a 9% cost of capital and has large reinvestment runway. Its BEST use of $1 of FCF is…",
                            "options": [
                                {
                                    "text": "a special dividend"
                                },
                                {
                                    "text": "reinvestment in the business",
                                    "correct": true
                                },
                                {
                                    "text": "buybacks at 40× earnings"
                                }
                            ],
                            "why": "Reinvesting at 22% against a 9% cost compounds value fastest — doors are ranked by return, and this door pays 22%."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "A $20B company (2B shares, $10/share) buys back 200M shares. Each remaining share's claim on the business rises by…",
                            "options": [
                                {
                                    "text": "10%"
                                },
                                {
                                    "text": "~11.1%",
                                    "correct": true
                                },
                                {
                                    "text": "20%"
                                }
                            ],
                            "why": "2B → 1.8B shares: 2/1.8 = 1.111. Buybacks are per-share concentration — valuable only if the price paid was below value."
                        },
                        {
                            "type": "choice",
                            "art": "dividend",
                            "prompt": "A firm pays $3.2B in dividends, generates $3.0B of FCF, and carries net debt/EBITDA of 3.8×. The dividend is…",
                            "options": [
                                {
                                    "text": "safe, it's been paid for 20 years"
                                },
                                {
                                    "text": "being funded beyond free cash on a stretched balance sheet: cut risk is high",
                                    "correct": true
                                },
                                {
                                    "text": "irrelevant to the stock"
                                }
                            ],
                            "why": "107% FCF payout + high leverage = the dividend is borrowed. History books are full of \"safe\" dividends with these numbers."
                        },
                        {
                            "type": "choice",
                            "art": "bond",
                            "prompt": "Total shareholder yield equals…",
                            "options": [
                                {
                                    "text": "dividend yield only"
                                },
                                {
                                    "text": "(dividends + net buybacks + net debt paydown) ÷ market cap",
                                    "correct": true
                                },
                                {
                                    "text": "EPS growth"
                                }
                            ],
                            "why": "It catches all three return-of-capital doors and nets out share issuance games."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Record corporate buyback volumes have historically clustered…",
                            "options": [
                                {
                                    "text": "at market bottoms"
                                },
                                {
                                    "text": "near market peaks (2007, 2021)",
                                    "correct": true
                                },
                                {
                                    "text": "evenly across cycles"
                                }
                            ],
                            "why": "Companies are flush and confident at tops, scared and cash-poor at bottoms — the exact reverse of good allocation. Judge managers against this base rate."
                        }
                    ]
                },
                {
                    "id": "investing-14",
                    "track": "investing",
                    "n": 14,
                    "title": "M&A, Deal Math & Corporate Actions",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "clock",
                            "title": "When companies buy companies",
                            "text": "Roughly $3-4 trillion of M&A happens in a normal year, and the evidence is settled and awkward: most acquisitions destroy acquirer value."
                        },
                        {
                            "art": "diversify",
                            "title": "The spread is a probability meter",
                            "text": "$62 offer $45 standalone trades $59. 90."
                        },
                        {
                            "art": "scale",
                            "title": "Spinoffs: the corporate action worth studying",
                            "text": "The reverse deal, a company splitting in two, has the OPPOSITE empirical record: spun-off entities have historically beaten the market in their first two years (the classic…"
                        },
                        {
                            "art": "supply",
                            "title": "The rest of the corporate-action zoo",
                            "text": "Tender offers : a company or raider offers to buy shares at a premium, often with proration, if 80% of holders tender into an offer for 25% of shares, each seller moves only ~31% of their…"
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "market",
                            "prompt": "A target trades at $57 after a $60 cash offer; standalone value is $45. The market-implied probability of closing is roughly…",
                            "options": [
                                {
                                    "text": "50%"
                                },
                                {
                                    "text": "80%",
                                    "correct": true
                                },
                                {
                                    "text": "95%"
                                }
                            ],
                            "why": "(57−45)/(60−45) = 12/15 = 80%."
                        },
                        {
                            "type": "choice",
                            "art": "candles",
                            "prompt": "On announcement day of a large premium acquisition, the typical pattern is…",
                            "options": [
                                {
                                    "text": "both stocks rise"
                                },
                                {
                                    "text": "target rises toward the offer; acquirer falls",
                                    "correct": true
                                },
                                {
                                    "text": "both fall"
                                }
                            ],
                            "why": "The target captures the premium; the acquirer wears the overpayment base rate."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Spinoffs have historically outperformed initially because…",
                            "options": [
                                {
                                    "text": "index and institutional holders sell them without regard to value, and incentives reset",
                                    "correct": true
                                },
                                {
                                    "text": "they're always better businesses"
                                },
                                {
                                    "text": "the SEC subsidizes them"
                                }
                            ],
                            "why": "Forced, valuation-blind selling + newly motivated management = the anomaly Greenblatt made famous."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "A company tenders for 20% of shares at a premium and 100% of holders tender. Each holder sells…",
                            "options": [
                                {
                                    "text": "all their shares"
                                },
                                {
                                    "text": "20% of their stake, proration",
                                    "correct": true
                                },
                                {
                                    "text": "nothing"
                                }
                            ],
                            "why": "Oversubscribed tenders fill pro-rata. Misjudging proration is the classic retail error in tenders."
                        },
                        {
                            "type": "choice",
                            "art": "diversify",
                            "prompt": "Your portfolio company announces it's acquiring a rival at a 38% premium, funded with debt, citing \"transformational synergies.\" The evidence-based prior is…",
                            "options": [
                                {
                                    "text": "value creation, synergies usually double"
                                },
                                {
                                    "text": "value destruction risk is elevated; most such deals underdeliver",
                                    "correct": true
                                },
                                {
                                    "text": "nothing changes"
                                }
                            ],
                            "why": "60-80% of premium acquisitions fail to earn back the premium. Priors aren't verdicts, but they set the burden of proof."
                        }
                    ]
                },
                {
                    "id": "investing-15",
                    "track": "investing",
                    "n": 15,
                    "title": "DCF in Practice: Valuing a Real Business",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "risk",
                            "title": "The theory in one sentence",
                            "text": "A business is worth the cash it will hand its owners over its remaining life, discounted to today at a rate reflecting the risk of those cash flows."
                        },
                        {
                            "art": "growth",
                            "title": "A full worked model",
                            "text": "Target: a software company, $1. 0B revenue growing 12% tapering to 6% by year five, 24% FCF margins, $200M net cash, 100M shares."
                        },
                        {
                            "art": "compound",
                            "title": "How professionals actually use it",
                            "text": "Not as a price oracle, as a discipline engine , three ways. Sensitivity tables : value across a grid of WACC × terminal growth; if the current price sits outside the entire plausible grid…"
                        },
                        {
                            "art": "compound",
                            "title": "The craft rules",
                            "text": "Terminal growth ≤ long-run GDP (~2-3%), anything higher assumes the company eventually becomes the economy."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "compound",
                            "prompt": "Year-5 FCF is $375M, terminal growth 3%, discount rate 10%. Terminal value at year 5 is…",
                            "options": [
                                {
                                    "text": "$3,750M"
                                },
                                {
                                    "text": "$5,518M",
                                    "correct": true
                                },
                                {
                                    "text": "$1,250M"
                                }
                            ],
                            "why": "TV = FCF × (1+g) ÷ (r − g) = 375 × 1.03 ÷ 0.07 ≈ $5,518M."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "In a typical DCF, the terminal value contributes roughly…",
                            "options": [
                                {
                                    "text": "10-20% of total value"
                                },
                                {
                                    "text": "60-75%+",
                                    "correct": true
                                },
                                {
                                    "text": "exactly 50%"
                                }
                            ],
                            "why": "Which is why the two terminal assumptions (g and WACC) dominate the output — and deserve the scrutiny."
                        },
                        {
                            "type": "choice",
                            "art": "compound",
                            "prompt": "A reverse DCF shows the current price implies 15 years of 18% growth. The correct use of this output is…",
                            "options": [
                                {
                                    "text": "shorting immediately, the model says overvalued"
                                },
                                {
                                    "text": "asking how often ANY company achieves that base rate, and sizing accordingly",
                                    "correct": true
                                },
                                {
                                    "text": "adjusting WACC until the model agrees with the price"
                                }
                            ],
                            "why": "The reverse DCF converts price into a testable claim. Base rates, not the model, provide the verdict."
                        },
                        {
                            "type": "choice",
                            "art": "compound",
                            "prompt": "Terminal growth of 5% forever in a 2.5%-GDP world implies…",
                            "options": [
                                {
                                    "text": "a reasonable mature company"
                                },
                                {
                                    "text": "the company eventually outgrows the entire economy, a modeling error",
                                    "correct": true
                                },
                                {
                                    "text": "nothing unusual"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "risk",
                            "prompt": "Cost of equity via CAPM with risk-free 4%, beta 1.3, equity premium 5% is…",
                            "options": [
                                {
                                    "text": "9.0%"
                                },
                                {
                                    "text": "10.5%",
                                    "correct": true
                                },
                                {
                                    "text": "6.5%"
                                }
                            ],
                            "why": "4 + 1.3×5 = 10.5%."
                        }
                    ]
                },
                {
                    "id": "investing-16",
                    "track": "investing",
                    "n": 16,
                    "title": "Special Situations: Spinoffs, Arbitrage & Forced Sellers",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "diversify",
                            "title": "Hunting where others must sell",
                            "text": "Most of the market is a fair fight against smart money. Special situations are the exception: corners where someone is transacting for reasons that have NOTHING to do with price, index…"
                        },
                        {
                            "art": "bond",
                            "title": "The catalog, with mechanics",
                            "text": "Post-reorg equities : companies exiting Chapter 11 hand new stock to former creditors, bond funds that are often forbidden or unwilling to hold equities."
                        },
                        {
                            "art": "target",
                            "title": "Process over prediction",
                            "text": "Special situations replace forecasting with reading: the edge is in SEC filings, the Form 10 (spinoffs), the S-4 (mergers), the plan of reorganization (bankruptcies), the tender offer terms."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Post-bankruptcy equities are systematically mispriced because…",
                            "options": [
                                {
                                    "text": "the businesses are always broken"
                                },
                                {
                                    "text": "creditors-turned-shareholders sell mechanically regardless of value, with no natural buyers",
                                    "correct": true
                                },
                                {
                                    "text": "the SEC restricts their prices"
                                }
                            ],
                            "why": "Bond mandates + no coverage + stigma = valuation-blind supply. The classic forced-seller setup."
                        },
                        {
                            "type": "choice",
                            "art": "wallet",
                            "prompt": "A closed-end fund trades at $8.50 with a $10.00 NAV. An activist wins a vote to liquidate. Your approximate return is…",
                            "options": [
                                {
                                    "text": "~17.6% as the discount closes to NAV",
                                    "correct": true
                                },
                                {
                                    "text": "zero, discounts are permanent"
                                },
                                {
                                    "text": "−15%"
                                }
                            ],
                            "why": "(10.00 − 8.50) / 8.50 ≈ 17.6%, realized when assets are sold at NAV. The catalyst converts discount into return."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The odd-lot tender edge exists because…",
                            "options": [
                                {
                                    "text": "it's illegal for funds"
                                },
                                {
                                    "text": "the profit is too small for institutions but meaningful for small accounts, a structural niche",
                                    "correct": true
                                },
                                {
                                    "text": "brokers hide it"
                                }
                            ],
                            "why": "99-share caps make it un-scalable. Structural edges survive precisely when they can't be arbitraged by size."
                        },
                        {
                            "type": "choice",
                            "art": "warning",
                            "prompt": "The core discipline shared by ALL special-situation investing is…",
                            "options": [
                                {
                                    "text": "faster trading"
                                },
                                {
                                    "text": "reading primary documents to map who is forced to do what, when",
                                    "correct": true
                                },
                                {
                                    "text": "technical analysis"
                                }
                            ],
                            "why": "The filings are the game. The market's laziness about page 40 is the recurring source of the return."
                        }
                    ]
                },
                {
                    "id": "investing-17",
                    "track": "investing",
                    "n": 17,
                    "title": "International Investing & Currency Risk",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "market",
                            "title": "Currency: the return you didn't order",
                            "text": "Buy a Japanese fund and you own two things: Japanese stocks AND the yen. The math is multiplicative: (1 + local return) × (1 + currency return) − 1."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "wallet",
                            "prompt": "A German fund returns +15% in euros while the euro falls 8% vs the dollar. Your dollar return is…",
                            "options": [
                                {
                                    "text": "+7%"
                                },
                                {
                                    "text": "+5.8%",
                                    "correct": true
                                },
                                {
                                    "text": "+15%"
                                }
                            ],
                            "why": "1.15 × 0.92 − 1 = 5.8%. Multiplicative, not additive."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The professional convention on currency hedging is…",
                            "options": [
                                {
                                    "text": "hedge everything always"
                                },
                                {
                                    "text": "hedge foreign bonds, generally not foreign stocks",
                                    "correct": true
                                },
                                {
                                    "text": "never hedge anything"
                                }
                            ],
                            "why": "FX noise swamps bond yields but is tolerable within equity volatility — and equity hedges cost the rate differential."
                        },
                        {
                            "type": "choice",
                            "art": "clock",
                            "prompt": "Hedging yen exposure when U.S. rates are 5% and Japanese rates are 0.5% costs roughly…",
                            "options": [
                                {
                                    "text": "nothing, hedges are free"
                                },
                                {
                                    "text": "~4.5% annually, the rate differential",
                                    "correct": true
                                },
                                {
                                    "text": "0.1%"
                                }
                            ],
                            "why": "Forward-rate hedging prices in the interest gap. Sometimes the \"hedge\" is the biggest position in the fund."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "China 2021 (education decree) and Russia 2022 (frozen holdings) both illustrate…",
                            "options": [
                                {
                                    "text": "EM always loses"
                                },
                                {
                                    "text": "political/structural risks in EM that no valuation screen captures",
                                    "correct": true
                                },
                                {
                                    "text": "currency risk only"
                                }
                            ],
                            "why": "State power over property rights is a risk category of its own — diversify across EM regimes, not just stocks."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The 2000s vs 2010s U.S./international reversal argues for…",
                            "options": [
                                {
                                    "text": "predicting the next regime"
                                },
                                {
                                    "text": "a fixed global allocation held through regimes with rebalancing",
                                    "correct": true
                                },
                                {
                                    "text": "abandoning international"
                                }
                            ],
                            "why": "Nobody called either turn. Fixed weights + bands harvest the reversals without requiring the forecast."
                        }
                    ]
                },
                {
                    "id": "investing-18",
                    "track": "investing",
                    "n": 18,
                    "title": "Building an Income Portfolio That Survives",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "compound",
                            "title": "Income is an engineering problem",
                            "text": "The capstone question of long-term investing eventually becomes: how does a pile of capital pay a reliable monthly bill, through crashes, inflation, and three decades of retirement, without…"
                        },
                        {
                            "art": "bond",
                            "title": "Bonds: ladders beat guesses",
                            "text": "Machine two: the bond ladder , equal amounts maturing in years 1 through 5 (or 10). Each maturing rung either pays the year's bills or re-buys the long rung at whatever rates then are."
                        },
                        {
                            "art": "bond",
                            "title": "The seductive machines, priced honestly",
                            "text": "Machine three: the high-yield tier , junk bonds (6-9%), covered-call funds (8-12% \"distribution yields\"), mREITs (10%+), BDCs."
                        },
                        {
                            "art": "bond",
                            "title": "The rule that beats all of them: total return",
                            "text": "The research verdict (Vanguard, Morningstar, and the entire safe-withdrawal literature): a portfolio built for TOTAL return, global stocks plus a bond ladder, funding withdrawals by selling…"
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "bond",
                            "prompt": "A stock yields 2.4% with dividends growing 9% annually. Your yield-on-cost after 8 years is roughly…",
                            "options": [
                                {
                                    "text": "2.4%"
                                },
                                {
                                    "text": "~4.8%",
                                    "correct": true
                                },
                                {
                                    "text": "9%"
                                }
                            ],
                            "why": "Dividends double in eight years at 9% growth (rule of 72): 2.4% → ~4.8% on your original cost — inflation protection bonds can't match."
                        },
                        {
                            "type": "choice",
                            "art": "bond",
                            "prompt": "A bond LADDER solves the rate-direction problem by…",
                            "options": [
                                {
                                    "text": "predicting rates with AI"
                                },
                                {
                                    "text": "rolling maturing rungs at current rates each year, averaging across environments",
                                    "correct": true
                                },
                                {
                                    "text": "never buying bonds under 5%"
                                }
                            ],
                            "why": "Rising rates raise your reinvestment; falling rates appreciate your long rungs. Either way the mechanism works."
                        },
                        {
                            "type": "choice",
                            "art": "bond",
                            "prompt": "A covered-call fund advertising a 11% \"distribution yield\" most importantly requires checking…",
                            "options": [
                                {
                                    "text": "the fund's logo"
                                },
                                {
                                    "text": "how much of the distribution is return of YOUR capital, and what upside was sold",
                                    "correct": true
                                },
                                {
                                    "text": "the manager's alma mater"
                                }
                            ],
                            "why": "Many such funds pay you with your own principal while capping rallies — the yield is real cash flow but not real income."
                        },
                        {
                            "type": "choice",
                            "art": "shield",
                            "prompt": "The safe-withdrawal research supports an initial withdrawal rate near…",
                            "options": [
                                {
                                    "text": "8%"
                                },
                                {
                                    "text": "3.5-4% indexed to inflation",
                                    "correct": true
                                },
                                {
                                    "text": "1%"
                                }
                            ],
                            "why": "The 4%-rule literature (Bengen, Trinity, updated by Morningstar/Vanguard) lands at 3.5-4% for 30-year horizons."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The bucket structure exists primarily to…",
                            "options": [
                                {
                                    "text": "maximize yield"
                                },
                                {
                                    "text": "prevent being forced to sell stocks during crashes, solving sequence-of-returns risk",
                                    "correct": true
                                },
                                {
                                    "text": "avoid all taxes"
                                }
                            ],
                            "why": "With 7+ years of spending outside equities, no bear market ever dictates your sell decisions. The buckets buy time, and time is what equities need."
                        }
                    ]
                }
            ]
        },
        {
            "key": "alternatives",
            "name": "Alternatives",
            "color": [
                "#7BD3A6",
                "#3E8C65"
            ],
            "lessons": [
                {
                    "id": "alternatives-1",
                    "track": "alternatives",
                    "n": 1,
                    "title": "What Are Alternative Investments?",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "shield",
                            "title": "Beyond stocks and bonds",
                            "text": "\"Alternatives\" is the umbrella for everything outside public stocks and bonds: real estate, cryptocurrencies, commodities like gold and oil, private equity, venture capital, hedge funds…"
                        },
                        {
                            "art": "scale",
                            "title": "The price of admission: liquidity and opacity",
                            "text": "Alternatives charge a toll. Many are illiquid, selling a building or a private-equity stake can take months or years, versus seconds for a stock."
                        },
                        {
                            "art": "diversify",
                            "title": "How much belongs in a portfolio?",
                            "text": "For most individual investors, alternatives are a seasoning, not the meal, commonly 5-20% of a portfolio, added only after a diversified core of stocks and bonds exists."
                        },
                        {
                            "art": "diversify",
                            "title": "Going deeper",
                            "text": "The honest test for any alternative: does it improve the portfolio, not just excite the owner? Ask three questions, does it zig when stocks zag (correlation), can I exit without losing a…"
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Which of these is an alternative investment?",
                            "options": [
                                {
                                    "text": "An S&P 500 index fund"
                                },
                                {
                                    "text": "A rental property",
                                    "correct": true
                                },
                                {
                                    "text": "A savings account"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "balance",
                            "prompt": "What is the main trade-off of illiquid alternatives?",
                            "options": [
                                {
                                    "text": "They can take months or years to sell, so you should demand higher returns",
                                    "correct": true
                                },
                                {
                                    "text": "They are always safer than stocks"
                                },
                                {
                                    "text": "They are tax-free"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "A sensible alternatives allocation for most individuals is…",
                            "options": [
                                {
                                    "text": "0%, they are always scams"
                                },
                                {
                                    "text": "Roughly 5-20%, after building a diversified core",
                                    "correct": true
                                },
                                {
                                    "text": "80% or more, like Yale"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "bond",
                            "prompt": "Which line behaves like Bitcoin, and which like a savings bond?",
                            "options": [
                                {
                                    "text": "A is the bond, B is Bitcoin"
                                },
                                {
                                    "text": "A is Bitcoin, B is the bond",
                                    "correct": true
                                },
                                {
                                    "text": "Both are stablecoins"
                                }
                            ],
                            "why": "Volatility is the giveaway — Bitcoin regularly swings more in a week than bonds do in a year."
                        }
                    ]
                },
                {
                    "id": "alternatives-2",
                    "track": "alternatives",
                    "n": 2,
                    "title": "Crypto Fundamentals",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "clock",
                            "title": "What a blockchain actually is",
                            "text": "A blockchain is a shared ledger no single party controls, thousands of computers hold identical copies and agree on every new entry."
                        },
                        {
                            "art": "book",
                            "title": "Volatility, cycles, and position sizing",
                            "text": "Crypto's returns and risks are both extreme: Bitcoin has crashed more than 75% four separate times and still ranks among the best-performing assets of the past 15 years."
                        },
                        {
                            "art": "book",
                            "title": "Custody: not your keys, not your coins",
                            "text": "Crypto has no fraud department and no password reset. Coins live at addresses controlled by private keys; whoever holds the keys owns the coins, hence the mantra \"not your keys, not your…"
                        },
                        {
                            "art": "risk",
                            "title": "Going deeper",
                            "text": "Position sizing is the entire crypto playbook for most investors: small enough that an 80% drawdown is an annoyance, large enough that a 10x matters."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "What enforces Bitcoin’s 21 million coin limit?",
                            "options": [
                                {
                                    "text": "The US Federal Reserve"
                                },
                                {
                                    "text": "The protocol’s math, verified by thousands of computers",
                                    "correct": true
                                },
                                {
                                    "text": "A vote among exchanges"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "What does \"not your keys, not your coins\" warn about?",
                            "options": [
                                {
                                    "text": "Losing coins on exchanges you don’t control",
                                    "correct": true
                                },
                                {
                                    "text": "Forgetting your brokerage password"
                                },
                                {
                                    "text": "High transaction fees"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "A sane approach to crypto position sizing is…",
                            "options": [
                                {
                                    "text": "Going all-in during bull markets"
                                },
                                {
                                    "text": "A small allocation you could watch fall 80% without panic",
                                    "correct": true
                                },
                                {
                                    "text": "Borrowing to buy more"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "diversify",
                            "prompt": "In this crash, stocks (red) fell while gold (amber) held. What is gold doing for the portfolio?",
                            "options": [
                                {
                                    "text": "Nothing, it missed the rally"
                                },
                                {
                                    "text": "Diversifying, it zigged while stocks zagged",
                                    "correct": true
                                },
                                {
                                    "text": "Adding leverage"
                                }
                            ],
                            "why": "Low correlation is the whole point of alternatives: one sleeve holding firm cushions the crash."
                        }
                    ]
                },
                {
                    "id": "alternatives-3",
                    "track": "alternatives",
                    "n": 3,
                    "title": "Real Estate for Beginners: Rent, Own, or REIT",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "book",
                            "title": "The three doors into property",
                            "text": "Real estate is the world's largest asset class, and you can touch it three ways: live in what you own, own what others rent, or buy shares of companies that own buildings for you."
                        },
                        {
                            "art": "dividend",
                            "title": "Being the landlord",
                            "text": "A rental property is a small business. The income is real: a $250,000 house renting for $1,900 a month grosses $22,800 a year."
                        },
                        {
                            "art": "dividend",
                            "title": "REITs: property without keys",
                            "text": "A REIT (real estate investment trust) is a company that owns income property, apartment complexes, warehouses, data centers, hospitals, and is legally required to pay out at least 90% of…"
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "A REIT is required to…",
                            "options": [
                                {
                                    "text": "guarantee its share price"
                                },
                                {
                                    "text": "pay out at least 90% of taxable income as dividends",
                                    "correct": true
                                },
                                {
                                    "text": "own only houses"
                                }
                            ],
                            "why": "That payout rule is what makes REITs income machines — and why they trade like income assets."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "A rental grosses $2,000/month. Using the half-expense rule, roughly what's left annually BEFORE the mortgage?",
                            "options": [
                                {
                                    "text": "$24,000"
                                },
                                {
                                    "text": "$12,000",
                                    "correct": true
                                },
                                {
                                    "text": "$2,000"
                                }
                            ],
                            "why": "Half of $24,000 gross ≈ $12,000 after taxes, insurance, repairs, vacancy and management."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The main financial advantage of owning your own home is…",
                            "options": [
                                {
                                    "text": "house prices always beat stocks"
                                },
                                {
                                    "text": "forced savings via the mortgage plus locked-in housing costs",
                                    "correct": true
                                },
                                {
                                    "text": "no expenses ever"
                                }
                            ],
                            "why": "Homes appreciate only modestly above inflation historically; the discipline of the payment is the quiet engine."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The biggest practical difference between a rental property and a REIT is…",
                            "options": [
                                {
                                    "text": "REITs are liquid and hands-off; rentals are a leveraged part-time business",
                                    "correct": true
                                },
                                {
                                    "text": "rentals are always more profitable"
                                },
                                {
                                    "text": "REITs can't lose value"
                                }
                            ],
                            "why": "Same asset class, opposite lifestyles. Neither is free money."
                        }
                    ]
                },
                {
                    "id": "alternatives-4",
                    "track": "alternatives",
                    "n": 4,
                    "title": "Gold & Precious Metals Basics",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "dividend",
                            "title": "Why people still buy rocks",
                            "text": "Gold has been money, jewelry, and crisis insurance for five thousand years. It pays no dividend, earns no interest, and builds nothing, so why does every central bank on Earth hold it?"
                        },
                        {
                            "art": "scale",
                            "title": "What actually moves the price",
                            "text": "Three forces do most of the work. Real interest rates : when savings accounts and bonds pay well above inflation, holding a metal that pays nothing hurts, and gold weakens; when rates are…"
                        },
                        {
                            "art": "clock",
                            "title": "How to actually own it",
                            "text": "Skip the pirate-chest fantasies. Gold ETFs (like GLD or IAU) hold bars in vaults and trade like stocks, the standard choice, costing roughly 0."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "clock",
                            "prompt": "Gold tends to perform best when…",
                            "options": [
                                {
                                    "text": "real interest rates are high"
                                },
                                {
                                    "text": "real interest rates are negative and trust is low",
                                    "correct": true
                                },
                                {
                                    "text": "the dollar is strengthening"
                                }
                            ],
                            "why": "When cash pays less than inflation, gold's zero yield stops being a handicap — and fear does the rest."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The cheapest practical way for a beginner to own gold is…",
                            "options": [
                                {
                                    "text": "collectible coins from TV ads"
                                },
                                {
                                    "text": "a large gold ETF like GLD or IAU",
                                    "correct": true
                                },
                                {
                                    "text": "a home safe of bars"
                                }
                            ],
                            "why": "Vaulted ETFs cost ~0.25%/yr with instant liquidity. Dealer coins cost 3–8% each way."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Gold mining stocks are…",
                            "options": [
                                {
                                    "text": "identical to owning gold"
                                },
                                {
                                    "text": "leveraged, riskier businesses tied to gold's price",
                                    "correct": true
                                },
                                {
                                    "text": "safer than gold"
                                }
                            ],
                            "why": "Miners add operating costs, debt, and management risk — they swing 2–3× as hard as the metal."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The main JOB of a small gold allocation is…",
                            "options": [
                                {
                                    "text": "beating the stock market"
                                },
                                {
                                    "text": "behaving differently when everything else falls",
                                    "correct": true
                                },
                                {
                                    "text": "paying steady income"
                                }
                            ],
                            "why": "It's portfolio insurance: dry powder in crises, boring the rest of the time."
                        }
                    ]
                },
                {
                    "id": "alternatives-5",
                    "track": "alternatives",
                    "n": 5,
                    "title": "Collectibles: Art, Watches & Cards",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "scale",
                            "title": "Passion assets with price tags",
                            "text": "Art, watches, wine, sneakers, and trading cards have all minted spectacular headlines, a LeBron card selling for $5M, Rolexes doubling in a year."
                        },
                        {
                            "art": "dividend",
                            "title": "The brutal economics under the romance",
                            "text": "Spreads are enormous, auction houses take 15-25%, authentication costs money, storage and insurance never stop, and there is no dividend while you wait."
                        },
                        {
                            "art": "book",
                            "title": "If you still want in",
                            "text": "Buy the best example you can afford of something with decades of collector history, blue-chip, not fads."
                        },
                        {
                            "art": "book",
                            "title": "Going deeper",
                            "text": "Sotheby's and Christie's data shows blue-chip art returning roughly 7% annually over decades, respectable, but earned with 20%+ round-trip transaction costs, years of illiquidity, and…"
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Collectibles must appreciate substantially just to overcome…",
                            "options": [
                                {
                                    "text": "Inflation only"
                                },
                                {
                                    "text": "Spreads, storage, insurance, and authentication costs",
                                    "correct": true
                                },
                                {
                                    "text": "Nothing"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Collectible prices are highly sensitive to…",
                            "options": [
                                {
                                    "text": "Weather"
                                },
                                {
                                    "text": "The liquidity and mood of wealthy buyers",
                                    "correct": true
                                },
                                {
                                    "text": "GDP revisions"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The wisest collectible strategy is…",
                            "options": [
                                {
                                    "text": "Chasing this year’s fad"
                                },
                                {
                                    "text": "Blue-chip items with long collector history, sized small",
                                    "correct": true
                                },
                                {
                                    "text": "Using leverage"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "bond",
                            "prompt": "Which line behaves like Bitcoin, and which like a savings bond?",
                            "options": [
                                {
                                    "text": "A is the bond, B is Bitcoin"
                                },
                                {
                                    "text": "A is Bitcoin, B is the bond",
                                    "correct": true
                                },
                                {
                                    "text": "Both are stablecoins"
                                }
                            ],
                            "why": "Volatility is the giveaway — Bitcoin regularly swings more in a week than bonds do in a year."
                        }
                    ]
                },
                {
                    "id": "alternatives-6",
                    "track": "alternatives",
                    "n": 6,
                    "title": "Gold vs. Bitcoin: The Store-of-Value Debate",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "book",
                            "title": "The case for the old rock",
                            "text": "Gold has 4,000 years of trust, near-zero correlation with stocks, central banks as permanent buyers, and no dependence on electricity or code."
                        },
                        {
                            "art": "book",
                            "title": "The case for the new code",
                            "text": "Bitcoin offers absolute scarcity (21M forever), portability across borders in seconds, and immunity from any single government's printing press."
                        },
                        {
                            "art": "diversify",
                            "title": "The grown-up answer",
                            "text": "They solve overlapping problems for different generations and risk appetites. Portfolio data says small allocations to either, or both, improved risk-adjusted returns over the past decade."
                        },
                        {
                            "art": "compound",
                            "title": "Going deeper",
                            "text": "The academic version of this debate is the \"value premium\" documented by Fama and French: over most long periods, cheap stocks have beaten expensive ones, but with decade-long stretches of…"
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Gold’s core weakness as an asset is…",
                            "options": [
                                {
                                    "text": "It rusts"
                                },
                                {
                                    "text": "It produces no cash flow and can stagnate for decades",
                                    "correct": true
                                },
                                {
                                    "text": "Central banks hate it"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Bitcoin’s scarcity comes from…",
                            "options": [
                                {
                                    "text": "Mining difficulty announcements"
                                },
                                {
                                    "text": "A hard 21 million coin cap in the protocol",
                                    "correct": true
                                },
                                {
                                    "text": "Government treaties"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The evidence-based approach to both is…",
                            "options": [
                                {
                                    "text": "All-in on one"
                                },
                                {
                                    "text": "Small, measured allocations as monetary insurance",
                                    "correct": true
                                },
                                {
                                    "text": "Avoiding both forever"
                                }
                            ]
                        },
                        {
                            "type": "choice",
                            "art": "diversify",
                            "prompt": "In this crash, stocks (red) fell while gold (amber) held. What is gold doing for the portfolio?",
                            "options": [
                                {
                                    "text": "Nothing, it missed the rally"
                                },
                                {
                                    "text": "Diversifying, it zigged while stocks zagged",
                                    "correct": true
                                },
                                {
                                    "text": "Adding leverage"
                                }
                            ],
                            "why": "Low correlation is the whole point of alternatives: one sleeve holding firm cushions the crash."
                        }
                    ]
                },
                {
                    "id": "alternatives-7",
                    "track": "alternatives",
                    "n": 7,
                    "title": "Rental Property Math, All the Way Down",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "book",
                            "title": "From daydream to spreadsheet",
                            "text": "The beginner module gave you the half-expense rule of thumb. This module replaces thumbs with the four numbers professional rental investors actually compute before making an offer: NOI…"
                        },
                        {
                            "art": "bond",
                            "title": "Cap rate: the property's yield",
                            "text": "Divide NOI by price and you get the cap rate , the property's unlevered yield. Our duplex at a $290,000 asking price: 20,066 ÷ 290,000 = 6."
                        },
                        {
                            "art": "bond",
                            "title": "Cash-on-cash: YOUR yield",
                            "text": "Cap rate ignores financing; cash-on-cash is where the mortgage returns. Take actual annual cash flow after debt service, divide by actual cash invested (down payment + closing costs +…"
                        },
                        {
                            "art": "risk",
                            "title": "DSCR and the safety margin",
                            "text": "Lenders check one more ratio: DSCR . NOI ÷ annual mortgage payments."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "A property grosses $48,000, loses $2,400 to vacancy, and has $15,600 of operating expenses. Its NOI is…",
                            "options": [
                                {
                                    "text": "$30,000",
                                    "correct": true
                                },
                                {
                                    "text": "$48,000"
                                },
                                {
                                    "text": "$45,600"
                                }
                            ],
                            "why": "48,000 − 2,400 − 15,600 = $30,000. Mortgage payments are excluded from NOI by definition."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "That property is offered at $375,000. Its cap rate is…",
                            "options": [
                                {
                                    "text": "12.5%"
                                },
                                {
                                    "text": "8.0%",
                                    "correct": true
                                },
                                {
                                    "text": "4.7%"
                                }
                            ],
                            "why": "30,000 ÷ 375,000 = 8.0% — the property's unlevered yield at that price."
                        },
                        {
                            "type": "choice",
                            "art": "dividend",
                            "prompt": "You invest $90,000 of cash; after-mortgage cash flow is $4,500/yr. Cash-on-cash return is…",
                            "options": [
                                {
                                    "text": "5.0%",
                                    "correct": true
                                },
                                {
                                    "text": "8.0%"
                                },
                                {
                                    "text": "20%"
                                }
                            ],
                            "why": "4,500 ÷ 90,000 = 5.0%. This is YOUR yield, after financing — distinct from the cap rate."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "NOI $30,000, annual debt service $26,000. DSCR ≈ 1.15×. Most lenders will…",
                            "options": [
                                {
                                    "text": "approve happily, above 1.0 is fine"
                                },
                                {
                                    "text": "balk, they typically want 1.20–1.25×",
                                    "correct": true
                                },
                                {
                                    "text": "require exactly 2.0×"
                                }
                            ],
                            "why": "1.15× is below the standard 1.20–1.25× box; expect a bigger down payment requirement or a no."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "A listing shows a cap rate 3 points above every comparable in the neighborhood. The correct instinct is…",
                            "options": [
                                {
                                    "text": "buy before someone else sees it"
                                },
                                {
                                    "text": "assume mispriced risk, deferred repairs, bad tenants, or fictional expense numbers",
                                    "correct": true
                                },
                                {
                                    "text": "cap rates don't matter"
                                }
                            ],
                            "why": "Markets rarely donate free yield. An outlier cap is a warning light, not a gift."
                        }
                    ]
                },
                {
                    "id": "alternatives-8",
                    "track": "alternatives",
                    "n": 8,
                    "title": "Analyzing REITs Like a Professional",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "scale",
                            "title": "Why REIT earnings are fake (legally)",
                            "text": "Look up any REIT's P/E ratio and you'll see something absurd. 60, 80, sometimes no earnings at all, for a company collecting rent from a thousand tenants."
                        },
                        {
                            "art": "dividend",
                            "title": "The dividend: test it, don't trust it",
                            "text": "REIT investors buy dividends, so test the dividend's plumbing. Compute the AFFO payout ratio : dividends ÷ AFFO."
                        },
                        {
                            "art": "balance",
                            "title": "Balance sheet and NAV",
                            "text": "REITs live on borrowed money, so two more checks. Net debt / EBITDA : under 5."
                        },
                        {
                            "art": "compound",
                            "title": "Sectors are the strategy",
                            "text": "Most of a REIT's fate is its sector. Industrial and data centers ride e-commerce and AI compute demand; cell towers are utilities with contracts; apartments track wage growth and local…"
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "scale",
                            "prompt": "Why is P/E nearly meaningless for REITs?",
                            "options": [
                                {
                                    "text": "REITs have no revenue"
                                },
                                {
                                    "text": "non-cash depreciation crushes reported earnings while buildings may appreciate",
                                    "correct": true
                                },
                                {
                                    "text": "REITs are exempt from accounting"
                                }
                            ],
                            "why": "FFO exists precisely to add that fictional depreciation back."
                        },
                        {
                            "type": "choice",
                            "art": "dividend",
                            "prompt": "A REIT reports net income $80M, depreciation $120M, gains on property sales $30M. FFO is…",
                            "options": [
                                {
                                    "text": "$170M",
                                    "correct": true
                                },
                                {
                                    "text": "$230M"
                                },
                                {
                                    "text": "$80M"
                                }
                            ],
                            "why": "80 + 120 − 30 = $170M."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "A REIT pays $3.00/share in dividends with AFFO of $2.80/share. The correct read is…",
                            "options": [
                                {
                                    "text": "a 107% payout, the dividend is being funded beyond cash flow and is at risk",
                                    "correct": true
                                },
                                {
                                    "text": "great, high payouts mean confidence"
                                },
                                {
                                    "text": "irrelevant, only yield matters"
                                }
                            ],
                            "why": "Paying more than AFFO means borrowing or issuing shares to fund the dividend. Cuts follow."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "A REIT trades 35% below its stated NAV. This means…",
                            "options": [
                                {
                                    "text": "guaranteed 35% upside"
                                },
                                {
                                    "text": "either a bargain or the market disbelieving stale building values, investigate which",
                                    "correct": true
                                },
                                {
                                    "text": "the REIT will be delisted"
                                }
                            ],
                            "why": "Office REITs in 2023 traded at huge \"discounts\" to NAVs that were themselves fantasy. The discount is a question."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Which combination is the healthiest?",
                            "options": [
                                {
                                    "text": "P/AFFO 30×, payout 98%, debt/EBITDA 8×"
                                },
                                {
                                    "text": "P/AFFO 17×, payout 72%, debt/EBITDA 5.2×",
                                    "correct": true
                                },
                                {
                                    "text": "P/AFFO 5×, payout 110%, debt/EBITDA 9×"
                                }
                            ],
                            "why": "Moderate multiple, cushioned payout, investment-grade leverage — boring and durable, which is the point."
                        }
                    ]
                },
                {
                    "id": "alternatives-9",
                    "track": "alternatives",
                    "n": 9,
                    "title": "Stablecoins, Ethereum & Crypto's Plumbing",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "scale",
                            "title": "The dollar that lives on a blockchain",
                            "text": "Bitcoin gets the headlines, but the workhorses of crypto are stablecoins , tokens engineered to always be worth $1."
                        },
                        {
                            "art": "book",
                            "title": "Ethereum: the world computer",
                            "text": "If Bitcoin is a calculator that does one thing perfectly, move value without a middleman — Ethereum is a computer anyone can program."
                        },
                        {
                            "art": "bond",
                            "title": "Where the yield comes from (and when it's fake)",
                            "text": "Crypto platforms advertise yields that make banks look silly. 4%, 8%, once 20%."
                        },
                        {
                            "art": "wallet",
                            "title": "Why this layer matters to an investor",
                            "text": "You may never open a DeFi app, but this plumbing now touches traditional finance: BlackRock runs a tokenized Treasury fund on Ethereum, Visa settles some transactions in USDC, and…"
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "A stablecoin's stability ultimately depends on…",
                            "options": [
                                {
                                    "text": "its logo and marketing"
                                },
                                {
                                    "text": "what actually backs it and whether holders believe they can redeem at $1",
                                    "correct": true
                                },
                                {
                                    "text": "the price of Bitcoin"
                                }
                            ],
                            "why": "USDC's SVB weekend proved the peg is exactly as strong as the reserves — and the market tests it in hours."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "TerraUSD collapsed because…",
                            "options": [
                                {
                                    "text": "hackers stole its Treasury bills"
                                },
                                {
                                    "text": "its algorithmic peg relied on circular incentives that failed in a bank-run dynamic",
                                    "correct": true
                                },
                                {
                                    "text": "the SEC banned it"
                                }
                            ],
                            "why": "No hard reserves — just code minting a sister token. When confidence broke, $40B evaporated in days."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Since the Merge, new ETH is primarily created by…",
                            "options": [
                                {
                                    "text": "mining with GPUs"
                                },
                                {
                                    "text": "proof-of-stake validation, offset by fee burning",
                                    "correct": true
                                },
                                {
                                    "text": "the Ethereum Foundation printing it"
                                }
                            ],
                            "why": "Stakers earn issuance ~3-4%; heavy usage burns fees, sometimes making ETH net-deflationary."
                        },
                        {
                            "type": "choice",
                            "art": "bond",
                            "prompt": "A platform offers 15% \"yield\" on deposits but can't explain who pays it. History says…",
                            "options": [
                                {
                                    "text": "it's early-adopter alpha"
                                },
                                {
                                    "text": "new deposits are paying old ones. Celsius/Anchor mechanics, and it will implode",
                                    "correct": true
                                },
                                {
                                    "text": "it's fine if the app is popular"
                                }
                            ],
                            "why": "Untraceable yield = you are the yield. Every 2022 blowup advertised exactly this way."
                        }
                    ]
                },
                {
                    "id": "alternatives-10",
                    "track": "alternatives",
                    "n": 10,
                    "title": "Fractional Real Estate & Crowdfunding Deals",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "scale",
                            "title": "The $100 building, honestly examined",
                            "text": "Crowdfunding platforms promise the previously impossible: a slice of an apartment complex for the price of dinner."
                        },
                        {
                            "art": "book",
                            "title": "The three questions that filter 90% of deals",
                            "text": "One: who is the sponsor and what is their track record across a full cycle? The platform is a shopping mall; the sponsor is the restaurant."
                        },
                        {
                            "art": "clock",
                            "title": "Illiquidity is a feature and a sentence",
                            "text": "Public REITs reprice every second; crowdfunded equity reprices when the sponsor says so. That smoothness feels pleasant, your statement never shows a crash, but the exit rules are the fine…"
                        },
                        {
                            "art": "candles",
                            "title": "The honest comparison",
                            "text": "There is no wrong row, only wrong matches between row and investor. The pattern to avoid is paying private-deal fees for public-market performance, which is the crowdfunding industry's…"
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "On a crowdfunding platform, \"preferred equity at 8%\" means…",
                            "options": [
                                {
                                    "text": "a guaranteed 8% government-style bond"
                                },
                                {
                                    "text": "priority over common equity but still behind the senior lender, wipeable in a big enough loss",
                                    "correct": true
                                },
                                {
                                    "text": "ownership of the building's title"
                                }
                            ],
                            "why": "Preferred sits in the middle of the stack: paid before common, after debt. \"Preferred\" describes order, not safety."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The single most predictive factor in a crowdfunded deal's outcome is…",
                            "options": [
                                {
                                    "text": "the website's design"
                                },
                                {
                                    "text": "the sponsor's full-cycle track record",
                                    "correct": true
                                },
                                {
                                    "text": "the projected IRR"
                                }
                            ],
                            "why": "Projections are the sponsor's free variable; realized history through a downturn is the only evidence."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "A deal grosses 13% but carries ~3.5% of annual fee equivalents. Your net is roughly…",
                            "options": [
                                {
                                    "text": "13%"
                                },
                                {
                                    "text": "9.5%",
                                    "correct": true
                                },
                                {
                                    "text": "3.5%"
                                }
                            ],
                            "why": "Gross minus the stacked fee load. Always compute the net before comparing to a 0.1% index fund."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "BREIT and Fundrise both \"gated\" redemptions. This demonstrates…",
                            "options": [
                                {
                                    "text": "fraud"
                                },
                                {
                                    "text": "that semi-liquid real estate funds are contractually allowed to suspend exits under stress, and do",
                                    "correct": true
                                },
                                {
                                    "text": "that real estate lost all value"
                                }
                            ],
                            "why": "Gates are in the documents precisely because buildings can't be sold to meet daily redemptions. Illiquidity is structural, not scandalous."
                        }
                    ]
                },
                {
                    "id": "alternatives-11",
                    "track": "alternatives",
                    "n": 11,
                    "title": "Commodities & Futures: Trading the Physical World",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "clock",
                            "title": "You can't buy a barrel (and you don't want to)",
                            "text": "Commodities are the rawest asset class, oil, gas, copper, corn, coffee, and the only one you can't sensibly hold in a drawer."
                        },
                        {
                            "art": "bond",
                            "title": "The curve is the strategy",
                            "text": "CONTANGO, curve rises BACKWARDATION, curve falls spot 6 months out 12 months Rolling futures in contango SELLS low / BUYS high every month, negative roll yield The futures curve, prices for…"
                        },
                        {
                            "art": "book",
                            "title": "Energy and agriculture have different physics",
                            "text": "Energy is geopolitics with a delivery schedule: OPEC decisions, wars, hurricanes in the Gulf, strategic reserve releases."
                        },
                        {
                            "art": "diversify",
                            "title": "Sane access routes",
                            "text": "Ranked by sanity for a non-professional: broad commodity index funds (DBC, PDBC, BCI) spread across 10+ commodities with roll-optimization, the default choice, 5–10% of a portfolio at most."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "A futures curve in contango means…",
                            "options": [
                                {
                                    "text": "future prices are above spot, rolling long positions bleeds money",
                                    "correct": true
                                },
                                {
                                    "text": "spot is above futures, rolling pays you"
                                },
                                {
                                    "text": "the commodity is banned"
                                }
                            ],
                            "why": "Sell low (expiring), buy high (next month), repeat: negative roll yield."
                        },
                        {
                            "type": "choice",
                            "art": "wallet",
                            "prompt": "Oil spot is flat all year, the curve sits in steady 1.5% monthly contango, and a fund rolls monthly. Its return is approximately…",
                            "options": [
                                {
                                    "text": "0%"
                                },
                                {
                                    "text": "about −16%",
                                    "correct": true
                                },
                                {
                                    "text": "+18%"
                                }
                            ],
                            "why": "Twelve −1.5% rolls compound to roughly −16%. The fund tracked the roll, not the barrel."
                        },
                        {
                            "type": "choice",
                            "art": "risk",
                            "prompt": "One crude futures contract (1,000 barrels at $75) on $6,000 margin embeds roughly what leverage?",
                            "options": [
                                {
                                    "text": "2:1"
                                },
                                {
                                    "text": "12–13:1",
                                    "correct": true
                                },
                                {
                                    "text": "100:1"
                                }
                            ],
                            "why": "$75,000 notional ÷ $6,000 margin ≈ 12.5×. A $3 oil move is half your margin."
                        },
                        {
                            "type": "choice",
                            "art": "scale",
                            "prompt": "April 2020's negative oil price happened because…",
                            "options": [
                                {
                                    "text": "oil became worthless forever"
                                },
                                {
                                    "text": "expiring contract holders had no storage and paid to escape physical delivery",
                                    "correct": true
                                },
                                {
                                    "text": "a computer glitch"
                                }
                            ],
                            "why": "Physical settlement + zero storage = holders paying $37/barrel to NOT receive oil."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The most defensible first commodity allocation for a regular investor is…",
                            "options": [
                                {
                                    "text": "3× leveraged natural gas ETF"
                                },
                                {
                                    "text": "a broad diversified commodity index fund at 5–10%",
                                    "correct": true
                                },
                                {
                                    "text": "personal soybean futures"
                                }
                            ],
                            "why": "Diversification across commodities + roll-aware indexes + small sizing = the adult version of the trade."
                        }
                    ]
                },
                {
                    "id": "alternatives-12",
                    "track": "alternatives",
                    "n": 12,
                    "title": "Building a Multi-Asset Portfolio",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "clock",
                            "title": "Collecting assets isn't diversifying",
                            "text": "You now hold the pieces: real estate, REITs, gold, commodities, crypto, and the traditional core of stocks and bonds."
                        },
                        {
                            "art": "candles",
                            "title": "The correlation numbers that matter",
                            "text": "Two honest footnotes. 2022 broke the stock/Treasury hedge, both fell double digits as inflation forced rates up, which is exactly why the inflation box (commodities were +16%) and the trend…"
                        },
                        {
                            "art": "bond",
                            "title": "A build sequence that survives contact",
                            "text": "Step 1, core first. A global stock index and a bond allocation appropriate to your horizon; this is 70–90% of the machine and it is boring on purpose."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "In a crisis, which pair is MOST likely to still be diversifying?",
                            "options": [
                                {
                                    "text": "US stocks and international stocks"
                                },
                                {
                                    "text": "stocks and managed futures",
                                    "correct": true
                                },
                                {
                                    "text": "stocks and high-yield bonds"
                                }
                            ],
                            "why": "Equity-DNA assets converge in stress; trend-following has historically been flat-to-positive in prolonged crashes."
                        },
                        {
                            "type": "choice",
                            "art": "risk",
                            "prompt": "A 5% allocation to an asset with 70% volatility contributes risk roughly equal to…",
                            "options": [
                                {
                                    "text": "5% in stocks"
                                },
                                {
                                    "text": "~25% in stocks (16% vol)",
                                    "correct": true
                                },
                                {
                                    "text": "nothing measurable"
                                }
                            ],
                            "why": "0.05×70 = 3.5 risk units ≈ 0.22×16. Size by risk contribution, not dollars."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "2022 demonstrated that…",
                            "options": [
                                {
                                    "text": "Treasuries always hedge stocks"
                                },
                                {
                                    "text": "inflation shocks can sink stocks AND bonds together, making the inflation/trend boxes essential",
                                    "correct": true
                                },
                                {
                                    "text": "diversification failed permanently"
                                }
                            ],
                            "why": "Both core assets fell double digits; commodities and managed futures were the year's working diversifiers."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The rebalancing rule's core function is…",
                            "options": [
                                {
                                    "text": "maximizing taxes"
                                },
                                {
                                    "text": "mechanically selling what rose and buying what fell, harvesting diversification without forecasts",
                                    "correct": true
                                },
                                {
                                    "text": "locking in a fixed dollar amount"
                                }
                            ],
                            "why": "Without the rule, drift concentrates you in whatever just spiked — the opposite of the design."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Which allocation request fails the \"name the job\" test?",
                            "options": [
                                {
                                    "text": "\"Gold, chaos hedge, 4%\""
                                },
                                {
                                    "text": "\"Managed futures, crisis behavior, 5%\""
                                },
                                {
                                    "text": "\"This AI-thematic ETF, it's the future, 15%\"",
                                    "correct": true
                                }
                            ],
                            "why": "\"It's the future\" is a growth-box bet with no distinct job — and 15% is a conviction size for a redundant exposure."
                        }
                    ]
                },
                {
                    "id": "alternatives-13",
                    "track": "alternatives",
                    "n": 13,
                    "title": "Commercial Real Estate & the Capital Stack",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "book",
                            "title": "CRE is a different sport",
                            "text": "Everything you learned about houses stops working the moment you buy a building whose tenants are businesses."
                        },
                        {
                            "art": "wallet",
                            "title": "The capital stack: who stands where",
                            "text": "No one buys a $50M building with $50M of their own cash. The purchase is financed in layers, and that layered structure, the capital stack , is the single most important diagram in real…"
                        },
                        {
                            "art": "risk",
                            "title": "Leverage cuts both ways, precisely",
                            "text": "The stack is a lever. Suppose the $50M building above carries $30M of senior debt and rises 20% to $60M."
                        },
                        {
                            "art": "book",
                            "title": "Property types are different businesses",
                            "text": "Lumping \"CRE\" together is like lumping airlines with software. Multifamily has hundreds of small leases that reprice yearly, inflation protection, but management-intensive."
                        },
                        {
                            "art": "risk",
                            "title": "The four risk styles",
                            "text": "Institutional investors sort every deal into four buckets that behave like the equity-style boxes of real estate."
                        },
                        {
                            "art": "scale",
                            "title": "How the math ties together",
                            "text": "Professionals underwrite a deal with three linked numbers. Going-in cap rate : NOI today over price today."
                        },
                        {
                            "art": "book",
                            "title": "What this means for you",
                            "text": "Every REIT you screen, every crowdfunding deal that lands in your inbox, every \"12% preferred return!"
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "scale",
                            "prompt": "A property produces $1.5M of NOI and the market cap rate is 6%. What is it worth?",
                            "options": [
                                {
                                    "text": "$9M"
                                },
                                {
                                    "text": "$25M",
                                    "correct": true
                                },
                                {
                                    "text": "$90M"
                                }
                            ],
                            "why": "Value = NOI ÷ cap rate = 1.5 ÷ 0.06 = $25M."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "That same property's cap rate rises from 6% to 7.5% with NOI unchanged. The value…",
                            "options": [
                                {
                                    "text": "rises 25%, to $31.3M"
                                },
                                {
                                    "text": "falls 20%, to $20M",
                                    "correct": true
                                },
                                {
                                    "text": "is unchanged, income didn't move"
                                }
                            ],
                            "why": "1.5 ÷ 0.075 = $20M. Cap-rate expansion destroyed $5M with no change in the building."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "A $40M building has $24M senior debt, $6M mezzanine, and $10M common equity. It sells for $28M. Who is impaired?",
                            "options": [
                                {
                                    "text": "Everyone shares the loss proportionally"
                                },
                                {
                                    "text": "Common wiped out, mezz loses $2M, senior fully repaid",
                                    "correct": true
                                },
                                {
                                    "text": "The senior lender takes the first loss"
                                }
                            ],
                            "why": "Losses climb from the bottom: the $12M loss consumes all $10M of common, then $2M of the $6M mezz. Senior gets its full $24M."
                        },
                        {
                            "type": "choice",
                            "art": "risk",
                            "prompt": "In the capital stack, which layer sits highest in RISK order?",
                            "options": [
                                {
                                    "text": "Senior debt"
                                },
                                {
                                    "text": "Preferred equity"
                                },
                                {
                                    "text": "Common equity",
                                    "correct": true
                                }
                            ],
                            "why": "Common equity is paid last and takes the first loss — the price of owning all the upside."
                        },
                        {
                            "type": "choice",
                            "art": "risk",
                            "prompt": "A deal claims a 16% target return but describes a fully leased Class A building with 50% leverage. What's wrong?",
                            "options": [
                                {
                                    "text": "Nothing, the return matches the risk"
                                },
                                {
                                    "text": "The return is core-style; the risk description is opportunistic"
                                },
                                {
                                    "text": "The risk is core; a 16% return promise doesn't come from core assets honestly",
                                    "correct": true
                                }
                            ],
                            "why": "Stabilized core assets earn 6–8%. A 16% \"core\" pitch means hidden leverage, hidden risk, or fiction."
                        }
                    ]
                },
                {
                    "id": "alternatives-14",
                    "track": "alternatives",
                    "n": 14,
                    "title": "Real Estate Debt: How Lending Really Works",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "clock",
                            "title": "The other side of the table",
                            "text": "Most investors only ever meet real estate debt as borrowers. But debt is a place to invest, an engine that sets property prices, and, when it goes wrong, the mechanism by which buildings…"
                        },
                        {
                            "art": "book",
                            "title": "The three numbers that size every loan",
                            "text": "Loan-to-value (LTV) is the blunt one: loan ÷ property value. At 65% LTV, the building must lose more than a third of its value before the lender is underwater."
                        },
                        {
                            "art": "bond",
                            "title": "Fixed vs. floating, and the 2022 object lesson",
                            "text": "Fixed-rate debt (banks, life insurers, CMBS) trades certainty for prepayment handcuffs, defeasance or yield-maintenance penalties that can cost millions if you sell early."
                        },
                        {
                            "art": "book",
                            "title": "Recourse, covenants, and the paperwork with teeth",
                            "text": "Most CRE debt is non-recourse : the lender's only remedy is the building, not the borrower's other assets, with \"bad-boy carve-outs\" that make the guarantee personal if the borrower commits…"
                        },
                        {
                            "art": "clock",
                            "title": "When it breaks: the default cascade",
                            "text": "Miss a payment or trip a covenant and the sequence is mechanical. First, penalty interest and a workout conversation."
                        },
                        {
                            "art": "book",
                            "title": "Investing in the debt yourself",
                            "text": "You can own this asset class from a brokerage account. Mortgage REITs (commercial ones like Starwood Property Trust or Blackstone Mortgage Trust) originate the loans above and pay out the…"
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "A building has $1.8M NOI and annual debt service of $1.5M. Its DSCR is…",
                            "options": [
                                {
                                    "text": "0.83×"
                                },
                                {
                                    "text": "1.2×",
                                    "correct": true
                                },
                                {
                                    "text": "3.3×"
                                }
                            ],
                            "why": "1.8 ÷ 1.5 = 1.2×. Income covers the mortgage with a 20% cushion."
                        },
                        {
                            "type": "choice",
                            "art": "bond",
                            "prompt": "A lender offers max 60% LTV, min 1.25× DSCR and min 10% debt yield on a $25M property with $1.75M NOI (annual loan constant 7.5%). Which constraint sets the loan?",
                            "options": [
                                {
                                    "text": "LTV → $15M"
                                },
                                {
                                    "text": "DSCR → $18.7M"
                                },
                                {
                                    "text": "Debt yield → $17.5M... so LTV binds at $15M",
                                    "correct": true
                                }
                            ],
                            "why": "LTV: $15M. DSCR: 1.75/1.25=1.4M capacity ÷ 0.075 = $18.7M. Debt yield: 1.75/0.10 = $17.5M. The loan is the minimum: $15M via LTV."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Why did floating-rate borrowers get crushed in 2022–23?",
                            "options": [
                                {
                                    "text": "Their index rate rose ~5 points, nearly tripling interest costs on some loans",
                                    "correct": true
                                },
                                {
                                    "text": "Fixed-rate penalties rose"
                                },
                                {
                                    "text": "Appraisals were banned"
                                }
                            ],
                            "why": "SOFR went from ~0% to 5.3%+. A SOFR+2.75% loan went from ~3% to ~8% interest, blowing through DSCR covenants."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "A mezzanine lender's collateral is typically…",
                            "options": [
                                {
                                    "text": "a second mortgage on the building"
                                },
                                {
                                    "text": "a pledge of the equity in the entity that owns the building",
                                    "correct": true
                                },
                                {
                                    "text": "the borrower's personal home"
                                }
                            ],
                            "why": "That UCC pledge is why mezz can foreclose in ~45 days by taking over the owning entity, senior loan and all."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "\"Non-recourse with bad-boy carve-outs\" means…",
                            "options": [
                                {
                                    "text": "the lender can never pursue the borrower personally"
                                },
                                {
                                    "text": "personal liability applies only if the borrower commits fraud or similar acts",
                                    "correct": true
                                },
                                {
                                    "text": "the loan converts to equity in default"
                                }
                            ],
                            "why": "The building is normally the lender's only remedy — unless the borrower does something on the carve-out list, which makes it personal."
                        }
                    ]
                },
                {
                    "id": "alternatives-15",
                    "track": "alternatives",
                    "n": 15,
                    "title": "Equity Waterfalls & the Promote",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "clock",
                            "title": "Where the equity's money actually goes",
                            "text": "The last two modules built the stack and priced the debt. This one answers the question every private real estate deal, private equity fund, and syndication ultimately turns on: when the…"
                        },
                        {
                            "art": "wallet",
                            "title": "The four classic tiers",
                            "text": "TIER 1 Return of capital 100% to LPs TIER 2 8% preferred return 100% to LPs TIER 3 GP catch-up 100% to GP* TIER 4 The split 80% LP / 20% GP Cash fills each pool COMPLETELY before one dollar…"
                        },
                        {
                            "art": "book",
                            "title": "A full worked waterfall",
                            "text": "Numbers make it honest. LPs invest $9M, the GP invests $1M (10% co-invest)."
                        },
                        {
                            "art": "wallet",
                            "title": "European vs. American, and the clawback",
                            "text": "In a European (whole-fund) waterfall , the GP earns no promote until every LP dollar across the entire fund, plus pref, is returned."
                        },
                        {
                            "art": "book",
                            "title": "Reading a real deal like an examiner",
                            "text": "Take any syndication PPM and run this sequence. One: find the pref, is it compounding or simple, cumulative or resetting?"
                        },
                        {
                            "art": "shield",
                            "title": "Why this module matters beyond real estate",
                            "text": "This exact machinery, pref, catch-up, carry, clawback, runs private equity, venture capital, hedge fund incentive fees, and infrastructure funds."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "In a standard waterfall, the GP's promote is paid…",
                            "options": [
                                {
                                    "text": "before the pref, as compensation for work"
                                },
                                {
                                    "text": "only after LPs receive their capital back plus the preferred return",
                                    "correct": true
                                },
                                {
                                    "text": "monthly, from rental income"
                                }
                            ],
                            "why": "Tiers 1 and 2 (capital + pref) fill completely before the GP sees promote in tiers 3–4."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "LPs invest $10M at an 8% simple pref. The deal distributes after 4 years. How much pref is owed before any promote?",
                            "options": [
                                {
                                    "text": "$0.8M"
                                },
                                {
                                    "text": "$3.2M",
                                    "correct": true
                                },
                                {
                                    "text": "$8M"
                                }
                            ],
                            "why": "10M × 8% × 4 years = $3.2M, on top of the $10M return of capital."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The purpose of a 100% GP catch-up tier is to…",
                            "options": [
                                {
                                    "text": "bring the GP to its full profit share (e.g. 20%) counting from the first profit dollar",
                                    "correct": true
                                },
                                {
                                    "text": "repay the GP's co-investment"
                                },
                                {
                                    "text": "cover fund expenses"
                                }
                            ],
                            "why": "After the LP pref, the GP takes 100% of distributions until it holds 20% of ALL profit paid — then the 80/20 split begins."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The clawback provision protects LPs against…",
                            "options": [
                                {
                                    "text": "rising interest rates"
                                },
                                {
                                    "text": "a deal-by-deal GP keeping promote from early winners while later deals lose",
                                    "correct": true
                                },
                                {
                                    "text": "property tax increases"
                                }
                            ],
                            "why": "American waterfalls pay promote per deal; the clawback forces the GP to true-up at fund end — if it's secured by escrow or guarantee."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "A deal projects exactly a 15.2% IRR, and the promote jumps from 20% to 35% above a 15% hurdle. The most cynical (and often correct) read is…",
                            "options": [
                                {
                                    "text": "the sponsor is conservative"
                                },
                                {
                                    "text": "coincidence"
                                },
                                {
                                    "text": "the projection was reverse-engineered to land just above the sponsor's richest tier",
                                    "correct": true
                                }
                            ],
                            "why": "Projections are the sponsor's only free variable. When they consistently land a hair above the steepest promote tier, the model was built backwards from the promote."
                        }
                    ]
                },
                {
                    "id": "alternatives-16",
                    "track": "alternatives",
                    "n": 16,
                    "title": "Private Equity & Venture: Fund Mechanics",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "wallet",
                            "title": "The machine behind the logos",
                            "text": "Module 15 gave you the waterfall. This module bolts it onto the two fund types that dominate private markets, buyout (PE) and venture (VC), and gives you the numbers professionals actually…"
                        },
                        {
                            "art": "dividend",
                            "title": "The J-curve and the three report cards",
                            "text": "Yr 1 Yr 5 Yr 10 fees + write-downs first exits and markups later 0 Cumulative net cash flow to LPs, the J-curve Fees are charged from day one on committed capital while investments are…"
                        },
                        {
                            "art": "wallet",
                            "title": "Anatomy of a leveraged buyout",
                            "text": "A buyout fund's craft is buying whole companies with borrowed money and selling them better, or at least more levered."
                        },
                        {
                            "art": "book",
                            "title": "Venture: the power law, quantified",
                            "text": "Venture is the opposite construction: no debt, no control, 20–40 tiny positions, and a return distribution so skewed that the average outcome is meaningless."
                        },
                        {
                            "art": "wallet",
                            "title": "Reading a PPM in ten minutes",
                            "text": "Fund documents run 200 pages; the economics live in five clauses. Fee basis : 2% on committed vs invested capital differs by hundreds of thousands per $10M over a fund's life."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "wallet",
                            "prompt": "A fund has called $80M, distributed $60M, and holds positions marked at $90M. DPI and TVPI are…",
                            "options": [
                                {
                                    "text": "DPI 0.75×, TVPI 1.875×",
                                    "correct": true
                                },
                                {
                                    "text": "DPI 1.875×, TVPI 0.75×"
                                },
                                {
                                    "text": "Both 1.125×"
                                }
                            ],
                            "why": "DPI = 60/80 = 0.75×. TVPI = (60+90)/80 = 1.875×. Cash back is still less than paid in."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The J-curve happens because…",
                            "options": [
                                {
                                    "text": "early fees and conservative marks precede later exits and markups",
                                    "correct": true
                                },
                                {
                                    "text": "funds lose money on purpose"
                                },
                                {
                                    "text": "IRR is calculated backwards"
                                }
                            ],
                            "why": "Fees on committed capital hit from day one while wins take years to surface."
                        },
                        {
                            "type": "choice",
                            "art": "scale",
                            "prompt": "An LBO buys a company for $800M with $500M debt. At exit, EBITDA is unchanged, the multiple is unchanged, but debt is down to $250M. The equity gained…",
                            "options": [
                                {
                                    "text": "nothing. EBITDA didn't grow"
                                },
                                {
                                    "text": "$250M, purely from deleveraging",
                                    "correct": true
                                },
                                {
                                    "text": "$500M"
                                }
                            ],
                            "why": "Enterprise value is flat at $800M; equity = 800 − 250 = $550M vs $300M at entry. Debt paydown alone moved $250M to the equity."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Roughly what share of venture deals return more than 10×, per the standard industry data?",
                            "options": [
                                {
                                    "text": "About 25%"
                                },
                                {
                                    "text": "About 4%",
                                    "correct": true
                                },
                                {
                                    "text": "Under 0.1%"
                                }
                            ],
                            "why": "~4% — and that sliver generates most of all venture profit. The median deal loses money."
                        },
                        {
                            "type": "choice",
                            "art": "wallet",
                            "prompt": "A young fund advertises a 28% IRR, DPI 0.1×. The professional response is…",
                            "options": [
                                {
                                    "text": "back the fund. 28% is elite"
                                },
                                {
                                    "text": "note that subscription lines and early marks can manufacture that IRR, and wait for DPI",
                                    "correct": true
                                },
                                {
                                    "text": "IRR is fraudulent"
                                }
                            ],
                            "why": "Trust DPI, respect TVPI, interrogate IRR — especially early, when credit-line timing dominates the calculation."
                        }
                    ]
                },
                {
                    "id": "alternatives-17",
                    "track": "alternatives",
                    "n": 17,
                    "title": "Hedge Fund Strategies & Leverage Math",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "risk",
                            "title": "What a hedge fund actually is",
                            "text": "Strip the mystique: a hedge fund is a lightly regulated private pool that can short, use leverage and derivatives, and charge performance fees, the same \"2 and 20\" waterfall you already…"
                        },
                        {
                            "art": "risk",
                            "title": "Long/short and the exposure ledger",
                            "text": "A long/short fund holds $130 long and $70 short per $100 of capital. Gross exposure = 130 + 70 = 200%, the total bet size, the leverage measure."
                        },
                        {
                            "art": "diversify",
                            "title": "Merger arbitrage: pricing deal risk",
                            "text": "deal announced: $40 offer $40 deal price trades ~$38. 80, the spread is the fee for deal risk $31 pre-deal If the deal closes: +3."
                        },
                        {
                            "art": "clock",
                            "title": "Global macro and relative value",
                            "text": "Global macro bets on currencies, rates and commodities with big asymmetry hunting: Soros shorting sterling in 1992 (~$1B profit in a day when the UK left the ERM), Paulson's CDS position…"
                        },
                        {
                            "art": "diversify",
                            "title": "The evidence, and the access question",
                            "text": "Aggregate hedge fund returns have lagged a 60/40 portfolio for most of the past 15 years, net of fees, but the aggregate hides enormous dispersion: top-decile multi-strategy shops (Citadel…"
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "wallet",
                            "prompt": "A fund is $150 long and $90 short per $100 of capital. Gross and net exposure are…",
                            "options": [
                                {
                                    "text": "Gross 240%, net 60%",
                                    "correct": true
                                },
                                {
                                    "text": "Gross 60%, net 240%"
                                },
                                {
                                    "text": "Both 150%"
                                }
                            ],
                            "why": "Gross = 150+90 = 240% (leverage). Net = 150−90 = 60% (direction)."
                        },
                        {
                            "type": "choice",
                            "art": "diversify",
                            "prompt": "A target trades at $58.50 after a $60 all-cash offer; it was $45 pre-announcement. The deal has ~4 months to close. The spread annualized is roughly…",
                            "options": [
                                {
                                    "text": "2.6% total ≈ 7.7% annualized",
                                    "correct": true
                                },
                                {
                                    "text": "25% annualized"
                                },
                                {
                                    "text": "0.5% annualized"
                                }
                            ],
                            "why": "Spread = 1.50/58.50 ≈ 2.56%; ×3 (12/4 months) ≈ 7.7% annualized — if it closes."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "LTCM's 1998 collapse primarily demonstrates that…",
                            "options": [
                                {
                                    "text": "its trades were wrong forever"
                                },
                                {
                                    "text": "extreme leverage can force liquidation before a correct trade converges",
                                    "correct": true
                                },
                                {
                                    "text": "Treasuries are risky"
                                }
                            ],
                            "why": "Most LTCM trades converged eventually — after margin calls had already destroyed the fund. Leverage sets your survival clock."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "A high-water mark means…",
                            "options": [
                                {
                                    "text": "the fund can't lose more than 10%"
                                },
                                {
                                    "text": "no performance fee is charged until previous losses are recouped",
                                    "correct": true
                                },
                                {
                                    "text": "redemptions are frozen at peaks"
                                }
                            ],
                            "why": "After a down year, the manager earns incentive fees only on gains above the old peak."
                        },
                        {
                            "type": "choice",
                            "art": "market",
                            "prompt": "Why did dozens of market-neutral quant funds lose big in the same week of August 2007?",
                            "options": [
                                {
                                    "text": "They all held the same crowded positions and deleveraged simultaneously",
                                    "correct": true
                                },
                                {
                                    "text": "The market crashed 20%"
                                },
                                {
                                    "text": "A rounding bug in VaR models"
                                }
                            ],
                            "why": "The market was roughly flat that week. The losses came from crowding: funds unwinding forced losses onto lookalike portfolios — correlation went to 1 through shared positioning, not shared views."
                        }
                    ]
                },
                {
                    "id": "alternatives-18",
                    "track": "alternatives",
                    "n": 18,
                    "title": "Risk Parity, Illiquidity & Portfolio Design",
                    "blurb": "",
                    "teach": [
                        {
                            "art": "book",
                            "title": "The capstone question",
                            "text": "Seventeen modules of instruments; this one is about assembly. The question that separates institutional portfolios from retail collections isn't \"what should I buy?"
                        },
                        {
                            "art": "book",
                            "title": "Dollars lie; volatility doesn't",
                            "text": "Quick math: stocks run ~16% annual volatility, bonds ~5%, with low correlation. In a 60/40, stocks contribute roughly 0."
                        },
                        {
                            "art": "wallet",
                            "title": "The illiquidity premium, real, and routinely overpaid for",
                            "text": "Locking money up should earn extra return: the illiquidity premium , historically estimated at ~1–4% annually for private equity and private real estate over public equivalents."
                        },
                        {
                            "art": "diversify",
                            "title": "An assembly protocol",
                            "text": "A defensible alternative sleeve gets built in this order. One: fix total risk first, decide portfolio-level volatility (or maximum tolerable drawdown) before choosing ingredients."
                        }
                    ],
                    "exercises": [
                        {
                            "type": "choice",
                            "art": "bond",
                            "prompt": "In a 60/40 portfolio (stock vol 16%, bond vol 5%), roughly what share of total risk comes from stocks?",
                            "options": [
                                {
                                    "text": "60%"
                                },
                                {
                                    "text": "~90%",
                                    "correct": true
                                },
                                {
                                    "text": "40%"
                                }
                            ],
                            "why": "0.6×16 vs 0.4×5 — about 9.6 vs 2.0 risk units. Dollar weights disguise an equity portfolio."
                        },
                        {
                            "type": "choice",
                            "art": "risk",
                            "prompt": "Risk parity portfolios typically use leverage because…",
                            "options": [
                                {
                                    "text": "managers are paid to gamble"
                                },
                                {
                                    "text": "equal-risk weighting is bond-heavy, so leverage restores an adequate expected return",
                                    "correct": true
                                },
                                {
                                    "text": "regulators require it"
                                }
                            ],
                            "why": "Equalizing risk means lots of low-vol bonds; leverage lifts the expected return back to equity-like levels."
                        },
                        {
                            "type": "choice",
                            "art": "growth",
                            "prompt": "Private funds report much lower volatility than REITs holding similar assets mainly because…",
                            "options": [
                                {
                                    "text": "private buildings are objectively safer"
                                },
                                {
                                    "text": "appraisal-based marks smooth and lag true price moves",
                                    "correct": true
                                },
                                {
                                    "text": "REITs use more leverage than any private fund"
                                }
                            ],
                            "why": "\"Volatility laundering\": quarterly appraisals anchored to prior marks cut measured vol in half or more without changing the buildings."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "The denominator effect describes…",
                            "options": [
                                {
                                    "text": "privates ballooning as a % of portfolio when public marks crash faster than private marks",
                                    "correct": true
                                },
                                {
                                    "text": "dividing by zero in IRR"
                                },
                                {
                                    "text": "fee compounding"
                                }
                            ],
                            "why": "Lagged private marks + crashed public values = \"over-allocation\" to privates precisely when you should be buying cheap public assets."
                        },
                        {
                            "type": "choice",
                            "art": "book",
                            "prompt": "Which allocation step comes FIRST in the protocol?",
                            "options": [
                                {
                                    "text": "Pick the highest-returning alternative"
                                },
                                {
                                    "text": "Set total portfolio risk before selecting any ingredient",
                                    "correct": true
                                },
                                {
                                    "text": "Maximize the number of asset classes"
                                }
                            ],
                            "why": "Risk budget first; ingredients second. A portfolio built ingredient-first is a collection, not a design."
                        }
                    ]
                }
            ]
        }
    ];

    function allCourses() {
        return TRACKS.reduce((a, t) => a.concat(t.lessons.map(l =>
            Object.assign({ trackName: t.name, color: t.color }, l))), []);
    }
    function byId(id) { return allCourses().find(c => c.id === id) || null; }
    function track(key) { return TRACKS.find(t => t.key === key) || null; }
    function stats() {
        const all = allCourses();
        return {
            tracks: TRACKS.length,
            courses: all.length,
            cards: all.reduce((s, c) => s + c.teach.length, 0),
            questions: all.reduce((s, c) => s + c.exercises.length, 0),
        };
    }

    global.FTCourses = { TRACKS, allCourses, byId, track, stats };
})(typeof window !== 'undefined' ? window : this);
