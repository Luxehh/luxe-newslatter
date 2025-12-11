import React from 'react';
import {
    Container,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
} from '@mui/material';
import {
    Info,
    Gavel,
    Edit,
    HealthAndSafety,
    Phone,
    Lock,
    Security,
    Person,
    Warning,
    NetworkWifi,
    ContactPhone,
    VerifiedUser,
    Payment,
    Language,
    Copyright,
    Cancel,
    Shield,
    ErrorOutline,
    MedicalServices,
    Balance,
    Description,
} from '@mui/icons-material';

const TermsAndConditions = () => {
    return (
        <Box className="page-container">
            <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        .page-container {
          min-height: 100vh;
          background-color: #f8f6f2;
          font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #212121;
        }
        header {
          background-color: #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 24px 16px;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
        }
        .content-card {
          border-radius: 12px;
          padding: 32px;
          margin-bottom: 32px;
        }
        .summary-section {
          margin-bottom: 48px;
        }
        .terms-grid {
          display: grid;
          gap: 32px;
        }
        footer {
          background-color: #424242;
          color: #ffffff;
          padding: 24px 16px;
        }
        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
          font-size: 0.875rem;
        }
        footer a {
          color: #ffffff;
          text-decoration: underline;
          transition: color 0.2s;
        }
        footer a:hover {
          color: #bdbdbd;
        }
        footer p {
          margin-top: 8px;
          color: #ffffff;
        }
        @media (max-width: 768px) {
          .content-card {
            padding: 24px;
          }
          .header-container {
            padding: 0 12px;
          }
        }
        @media (max-width: 480px) {
          .content-card {
            padding: 16px;
          }
          .header-container {
            padding: 0 8px;
          }
        }
      `}</style>

            {/* Header */}
            <header>
                <Box className="header-container">
                    <Typography variant="h3" component="h1" color="#7b6e4b" fontWeight={'bold'} gutterBottom>
                        Terms and Conditions
                    </Typography>
                </Box>
            </header>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ my: 4 }}>
                <Paper className="content-card" elevation={3}>
                    {/* Summary Section */}
                    <section className="summary-section">
                        <Typography variant="h4" component="h2" color="#7b6e4b" fontWeight={'bold'} gutterBottom>
                            Summary
                        </Typography>
                        <Typography variant="body1" textAlign={'justify'} color="textSecondary">
                            Here’s a summary of what you need to know. You can find a full version of these terms below.
                        </Typography>
                        <Typography variant="body1" textAlign={'justify'} color="textSecondary">
                            Our collective aim is to send you the right information at the right time to better help manage your Heart condition at home with services provided by Luxe Home Health.
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <Info color="info" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="The texts are automated and include both scheduled informational messages and automated responses to your questions through our Messaging system. These messages are not being sent to you by the Luxe home health team or your physician."
                                    sx={{ textAlign: 'justify' }}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <Warning color="info" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Your Luxe Home Health team nor does your physician monitor these messages. While our Messaging service can guide you on how to manage your Heart conditions, you may not use this service to contact the Luxe Home Health team or your physician about urgent or emergent health issues. If you're having a medical emergency, call 911."
                                    sx={{ textAlign: 'justify' }}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <HealthAndSafety color="info" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="The text program uses artificial intelligence (AI) to provide automated responses to your questions about Heart Health and recovery. To improve the accuracy of our responses, we use de-identified message data to enhance our service."
                                    sx={{ textAlign: 'justify' }}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <Lock color="info" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="We take your privacy very seriously and are fully compliant with the federal government regulations regarding the privacy of personal health information (PHI)."
                                    sx={{ textAlign: 'justify' }}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <Security color="info" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Your information is stored securely on encrypted cloud-based servers. However, as noted below, the SMS messages themselves are not encrypted during transmission."
                                    sx={{ textAlign: 'justify' }}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <Person color="info" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="If you elect to include your PHI in a response, please be aware that short message service (SMS) and multimedia message (MMS) do have security shortcomings. This program will only recognize pre-determined keyword responses. They are unencrypted and may be stored on your mobile service provider's server for a short period of time."
                                    sx={{ textAlign: 'justify' }}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <HealthAndSafety color="info" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Messages are limited to your Heart Health and management of your Heart condition. You will only receive messages relevant to your Heart Health."
                                    sx={{ textAlign: 'justify' }}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <ContactPhone color="info" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="If there is a difference between the information in a text message and what you were told by your physician, follow their individual instructions for you."
                                    sx={{ textAlign: 'justify' }}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <Phone color="info" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Please, when in doubt, call your physician's office for further clarification."
                                    sx={{ textAlign: 'justify' }}
                                />
                            </ListItem>
                        </List>
                    </section>

                    <Divider sx={{ my: 4 }} />

                    {/* Full Terms */}
                    <section className="terms-grid">
                        <Box>
                            <Typography variant="h4" component="h2" color="#7b6e4b" gutterBottom>
                                Introduction
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="textSecondary">
                                The services that Luxe Home Health provides to you are subject to the terms and conditions set forth herein (“Terms and Conditions”), which govern your access to and use of our opt-in SMS Messaging service and common carrier services we provide (collectively the “Services”). By enrolling in the Luxe Home Health SMS program, you agree to be bound by the following Terms and Conditions.
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="textSecondary">
                                By enrolling in the Luxe Home Health Service (texting “JOIN”) you consent to receive mobile text messages and are entering into a legally binding agreement with Luxe Home Health. If you do not accept these Terms and Conditions, now or in the future, please stop your use immediately, in which case any continuing access to and/or use of our Services is unauthorized. To opt-out at any time please text (STOP)
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="h5" component="h3" color="#7b6e4b" gutterBottom>
                                <Gavel sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Program
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="textSecondary">
                                Luxe Home Health’s Heart Health SMS is a Messaging program that sends automated and pre-programed SMS text messages to your cell phone. Luxe Home Health has artificial intelligence and natural language processing capabilities that allow you to receive additional information on Heart Health topics. The automated SMS responses from Luxe Home Health delivered to your phone primarily use your physician's instructions and protocols as a reference, but may also utilize general training data to provide comprehensive answers to your questions. Please be advised that we do not guarantee the completeness or accuracy of any Luxe Home Health content, including any output generated in connection with your use of the Luxe Home Health Messaging. You acknowledge and agree that you use and rely on the Luxe Home Health Messaging at your own risk, and that Luxe Home Health will not be liable for any errors or inaccuracies.
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="textSecondary">
                                You understand and agree that 1) the information in the messages is standardized and not specific to your individual treatment, 2) the Luxe Home Health Messaging and related services do not provide medical advice, diagnosis, treatment, or prescriptions, either through the Messaging, the website, or any other services; and 3) this Messaging should not be used in medical emergencies and does not support emergency calls. The services and content are not a substitute for professional medical advice, diagnosis, treatment or prescriptions. Please seek medical advice and treatment only from a healthcare provider. In case of a medical emergency, call your country’s emergency number immediately. Never disregard professional medical advice or delay in seeking it because of something you have read through the services. You understand that the services we provide is for information purposes only; it is not medical advice. We have no responsibility to take any medically related action or provide medical advice in response to any information you provide through our services.
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="textSecondary">
                                ARBITRATION NOTICE: EXCEPT FOR CERTAIN TYPES OF DISPUTES DESCRIBED IN THE ARBITRATION CLAUSE BELOW, YOU AGREE THAT DISPUTES BETWEEN YOU AND LUXE HOME HEALTH WILL BE RESOLVED BY MANDATORY BINDING ARBITRATION AND YOU WAIVE ANY RIGHT TO PARTICIPATE IN A CLASS-ACTION LAWSUIT AND/OR CLASS-WIDE ARBITRATION.
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="h5" component="h3" color="#7b6e4b" gutterBottom>
                                <Edit sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Changes
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="textSecondary">
                                Luxe Home Health may, at any time, for any reason, make changes to the Services and/or modify this Terms and Conditions in its sole discretion. We may make such changes and/or modifications to the terms and conditions contained herein and your continued use of the Service following changes and/or modifications will constitute your acceptance of such changes and/or modifications. Luxe Home Health will provide a notice of such changes by texting the updated Terms of Conditions on the Service and changing the ‘Last Updated’ date listed above. We may also provide you additional forms of notice of modifications and/or updates as appropriate under the circumstances. If you do not agree to the changes and/or modifications, you must immediately reply “STOP” using your mobile number. Your continued access to and/or use of the Service after such posting constitutes your consent to be bound by such Terms and Conditions, as amended.
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="h5" component="h3" color="#7b6e4b" gutterBottom>
                                <HealthAndSafety sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Scope of Use
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="textSecondary">
                                <strong>Intended Use.</strong> Service is intended to support patients who are preparing or recovering for surgery in the immediate perioperative period, defined as the time period that extends from three months before surgery to six months after surgery.
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="textSecondary">
                                <strong>Eligibility and Use of Service.</strong> By signing up for the Service, you are confirming that you are over the age of eighteen (18). You understand that we will send mobile text messages using automated technology. The automated messages are sent at pre-programmed, designated intervals before and after surgery. The information in the messages is standardized and not specific to your individual treatment. Our Service is compatible with major wireless carriers (including but not limited to AT&T, Verizon Wireless, Sprint, T-Mobile®, U.S. Cellular®) (collectively "Telecommunication Provider").
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="textSecondary">
                                You may be enrolled in Luxe Home Health services either through self-enrollment, where you directly provide your information to us, or through physician office enrollment, where your physician's office enrolls you through our affiliate Partner Portal.
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="textSecondary">
                                Luxe Home Health authenticates the end user through an elective enrollment process. By providing Luxe Home Health with your mobile number, you give Luxe Home Health permission to send text-messages to the mobile number provided when you enroll. By texting "JOIN" to the number on the Luxe Home Health enrollment card, you agree to participate in the Luxe Home Health text-messaging service and authenticate that you are the owner and subscriber for this mobile number. Standard message and data rates may apply. Messaging frequency varies based on needs and responses.
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="textSecondary">
                                <strong>Availability.</strong> Luxe Home Health retains the right, in our sole discretion, to deny service and/or access to anyone at and/or use of any time and for any reason. While we use reasonable efforts to keep the Service accessible, the Service may be unavailable from time to time. You understand and agree that there may be interruptions to the Service due to circumstances both within Luxe Home Health’s control (e.g., routine maintenance) and outside of our control. You acknowledge and agree that Luxe Home Health will not be liable for any delays in the receipt of any SMS messages as delivery is subject to effective transmission from your network operator. You acknowledge and agree that use of the Service is at your own risk, including but not limited to the limitation of you might be exposed to content that is inaccurate and/or objectionable. The Service may be modified, updated, suspended or discontinued at any time without notice and/or liability.
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="h5" component="h3" color="#7b6e4b" gutterBottom>
                                <Phone sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Communication
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="textSecondary">
                                By participating in Luxe Home Health Services, you understand and agree that to have your mobile number stored on a cloud server. Your mobile server number is linked to Luxe Home Health, date of start of service. Our cloud server is enabled with encryption services at rest and in transit and meets the Health Insurance Portability and Accountability Act (HIPAA) rules and regulations. When you access and/or and/or use the Service, you are communicating with us electronically, and you consent to receive communications from us electronically. You agree that all agreements, notices, disclosures and/or other communications that we provide to you electronically satisfy any legal requirement that such communications be in writing.
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="textSecondary">
                                You understand that standard SMS (text messaging) is by nature not encrypted during transmission. While we protect your data within our systems, standard text messages are subject to the inherent security limitations of SMS technology during transmission. Where available, enhanced security through twilio.com and railway.com may be applied. You understand that SMS and MMS are transmitted unencrypted through your third party mobile carrier during transmission and that you provide responses in your own discretion.
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="h5" component="h3" color="#7b6e4b" gutterBottom>
                                <Lock sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Your Privacy
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="textSecondary">
                                To protect your privacy, information in the text messages are never associated with your personal information including your name, date of birth, social security number or any other demographic information. Data obtained from you in connection with the Service may include your mobile number, your carrier's name, the date, time and content of your messages and other information provided to us in connection with the Service. We may use this to contact you and provide the Services you request from us.
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="textSecondary">
                                You understand that SMS and MMS messages are transmitted unencrypted through your third party mobile carrier before reaching your cell phone during transmission and that you provide responses in your own discretion. Please be advised that responses are not monitored at the time you respond to the Luxe Home Health program. Luxe Home Health does not control and/or endorse the mobile carrier and is not responsible for any mobile carrier services from you. Messages sent via SMS/MMS have security limitations and may be stored temporarily on your mobile carrier's servers during transmission unencrypted, which may not have the same security measures as those of Luxe Home Health's server’s. Mobile carriers may not access the information on their servers on an regular basis, but rather on an random or infrequent basis as necessary to for their analysis; therefore, they do not carry qualify as a business associate to Luxe Home Health or to the covering entity by which your surgeon is associated with to. You agree to make your own independent judgment regarding your interactions with them at your own risk.
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="h5" component="h3" color="#7b6e4b" gutterBottom>
                                <Person sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Your Responsibilities
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="text">
                                You agree not to use our Service for any illegal and/or unauthorized purpose and/or to violate any federal laws, state or international laws in your jurisdiction (including but not limited to copyright laws), code of conduct or other applicable guidelines which may be applicable to the Service. You must not transmit any materials through the Service that contain any harmful component, any worms or viruses or any other code of a destructive nature. You may not use the Service in any manner that could damage or disrupt, disable, or interfere with impair the Service or others’ use of the Service. You may not access any part or all of the Service in order to build a product or service that competes with our Service. You shall not attempt or obtain any attempt to obtain any data through any means from the Service, except as intended by us to provide and/or make available to you. You agree not attempt to access data not intended for, monitor the Service for data gathering, or interfere with the Service to any user in any way manner that may A violation of these Terms and Conditions will result in immediate termination of your access to and/or use of our Service.
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="h5" component="h3" color="#7b6e4b" gutterBottom>
                                <NetworkWifi sx={{ verticalAlign: 'middle', mr: 1 }} />
                                General Conditions
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="text">
                                We reserve the right to refuse Service to anyone for any reason at any time. You understand that and messages may be transferred unencrypted and during involve (transmission a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or and/or devices. The Internet/telecommunications platform is an open network and provides no inherent protection for confidential information during transmission. By enrolling in Luxe Home Health, you accept these risks by enrolling in.
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="h5" component="h3" color="#7b6e4b" gutterBottom>
                                <ContactPhone sx={{ verticalAlign: 'middle', mr: 1 }} /> Contacting Providers
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="text">
                                You agree that E-mail and/or text messages to Luxe Home Health must not be the primary means of communication with your healthcare team. You must contact Luxe Home Health by telephone or in person about critical or time-sensitive issues or issues.
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="h5" component="h3" color="#7b6e4b" gutterBottom>
                                <VerifiedUser sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Information Accuracy
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="text">
                                There may be occasional information on the Service that contains typographical errors, inaccuracies or omissions that may relate to descriptions, instructions or availability and. The material on this Service is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting your physician first. Any reliance upon on the material received is at your own risk. We reserve the right to: (i) correct any errors or inaccuracies, or omissions; and/or (ii) make changes to content, descriptions, specifications or other information without obligation prior to notice of such changes, except as required by law. To protect the patient-Home Health relationship, no emergency, time-sensitive, life-threatening or urgent health care information will be delivered to you via Luxe Home Health SMS. For medical questions, contact the Luxe Home Health or physician’s office, or if you are experiencing a medical emergency, call 911.
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="h5" component="h3" color="#7b6e4b" gutterBottom>
                                <Payment sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Charges
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="text">
                                Luxe Home Health does not charge a fee for your use of the Service and we are not responsible for any other charges from your mobile carrier that may result from providing this Service. It is your responsibility to check with your carrier, as standard rates may apply for messages and data rates. All charges are billed by and payable to your mobile service provider. Luxe Home Health assumes no responsibility for charges incurred by signing up for this Service. Any text messaging fees that you may incur will be billed based on your individual plan with your mobile carrier’s plan.
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="h5" component="h3" color="#7b6e4b" gutterBottom>
                                <Language sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Service Use Outside Defined Area
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="text">
                                The Service is directed to those individuals and entities located in the United States. It is not directed to any person or entity in any jurisdiction where (by reason of nationality, residence, citizenship or otherwise) the publication or availability of the Service and its content are unavailable or otherwise contrary to local laws or regulations. If you are in such a jurisdiction, you are not authorized to access and/or use the Service. Those who choose to access the Service from other locations outside do so at their own risk and are responsible for compliance with applicable local laws.
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="h5" component="h3" color="#7b6e4b" gutterBottom>
                                <Copyright sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Proprietary Rights and Licenses
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="textSecondary">
                                <strong>Ownership</strong>. The Service, any content on the Service and the infrastructure used to provide the Service are proprietary to Luxe Home Health, our affiliates and other content providers. By using the Service and accepting these Terms and Conditions (a) Luxe Home Health grants you a limited, personal, nontransferable use, nonexclusive, revocable right to access and/or access the Service pursuant to these terms and Conditions and to any additional terms and policies set forth by Luxe Home Health; and (b) you agree not to not reproduce, distribute, create, create derivative works from, publicly display, or sell or perform, license, or re-sell any content, and/or services obtained from the Service without the express written permission of Luxe Home Health.
                            </Typography>
                            <Typography texts variant="body1" textAlign={'justify'} color="textSecondary">
                                <strong>Reservation of Rights</strong> Rights to the materials and content on the Service (“Content”) are copyrighted and protected by United States law and international copyright laws and treaty provisions. Luxe Home Health owns, controls, uses and/or licenses lawfully its Content on the Service. Luxe Home Health’s name and logo may not be copied, imitated or used without prior written permission. Subject to the limited rights expressly granted herein, Luxe Home Health and/or its third-party providers reserve all right, title and interest in and to all services and content, including all related worldwide intellectual property rights worldwide. No rights are granted to you hereunder other than those expressly set forth herein.
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="textSecondary">
                                <strong>No Reverse Engineering</strong> You understand and agree that this messaging service contains valuable confidential information and you agree to not to modify, reverse engineer, decompile, create other works from, or disassemble this service without the prior written consent of Luxe Home Health.
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="textSecondary">
                                <strong>Feedback</strong>. Please keep in mind that we do not seek any unsolicited ideas or feedback for the Service. If you provide feedback, suggestions, improvements or enhancements, recommendations or feature requests relating to the Service (“Feedback”), you grant Luxe Home Health an worldwide, perpetual, irrevocable, royalty-free license to use and incorporate any such Feedback without compensation to you. Luxe Home Health has no obligation to review any Feedback and may use or redistribute it for any purpose without restriction in its sole discretion.
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="h5" component="h3" color="#7b6e4b" gutterBottom>
                                <Cancel sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Termination
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="textSecondary">
                                <strong>Our Termination</strong>. If you violate or we suspect you have grounds to violate these Terms and Conditions or other usage parameters included on the Service, we may refuse access to you or use of the Service. We also reserve the right, in our sole discretion, to terminate your access to the Service and unsubscribe you without cause or notice or liability. If you misuse the Service by any means actionable under federal, state or local statute, code, regulation, law or civil action, we will consider your access as having been acquired by fraud or misrepresentation and terminate your access immediately. In such cases, Luxe Home Health retains the right to seek civil or criminal redress, with all costs borne by you.
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="textSecondary">
                                <strong>Opt-Out</strong>. Content in messages is automated and may not apply exactly to you. If you feel the content is not relevant or wish to discontinue use of the Service for any reason, reply “STOP” from your mobile number. Data message rates may apply.
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="h5" component="h3" color="#7b6e4b" gutterBottom>
                                <Shield sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Indemnification and Waiver
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="text">
                                You shall indemnify, defend and hold harmless Luxe Home Health, its officers, agents, employees, contractors, subcontractors and suppliers from any claims, demands, proceedings, losses or damages arising out of (i) your violation of any law or third-party rights, including the Telephone Consumer Protection Act, due to text messages; (ii) your use of the Service or breach of these Terms; or (iii) your intentional misconduct or negligence. You must promptly notify Luxe Home Health of any claim that may lead to a claim against us.
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="h5" component="h3" color="#7b6e4b" gutterBottom>
                                <ErrorOutline sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Disclaimer of Warranties
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="text">
                                YOU AGREE THAT, TO THE MAXIMUM EXTENT PERMITTED BY LAW:
                                THE SERVICE AND CONTENT ARE PROVIDED “AS IS,” WITHOUT ANY WARRANTY, INCLUDING IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY, FITNESS FOR A PURPOSE, OR ACCURACY, ALL OF WHICH LUXE HOME HEALTH DISCLAIMS. LUXE HOME HEALTH DOES NOT GUARANTEE THAT THE SERVICE WILL MEET YOUR NEEDS, BE UNINTERRUPTED, SECURE OR ERROR-FREE, OR THAT RESULTS WILL BE ACCURATE OR RELIABLE. LUXE HOME HEALTH IS NOT LIABLE FOR ANY DELAYS OR FAILURES IN UPDATING THE SERVICE. NO ADVICE OR INFORMATION FROM LUXE HOME HEALTH CREATES ANY WARRANTY NOT STATED HEREIN.
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="h5" component="h3" color="#7b6e4b" gutterBottom>
                                <ErrorOutline sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Limitation of Liability
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="text">
                                YOUR USE OF THE SERVICE IS AT YOUR OWN RISK. LUXE HOME HEALTH, ITS OFFICERS, DIRECTORS, EMPLOYEES OR SUPPLIERS SHALL NOT BE LIABLE FOR ANY SPECIAL, INDIRECT OR CONSEQUENTIAL DAMAGES, INCLUDING LOSS OF DATA OR PROFITS, WHETHER IN CONTRACT, TORT OR OTHERWISE, EVEN IF ADVISED OF SUCH DAMAGES. THIS APPLIES DESPITE ANY NEGLIGENCE OR ERRORS BY LUXE HOME HEALTH. IN STATES WHERE LIABILITY EXCLUSION IS LIMITED, OUR LIABILITY IS THE MAXIMUM PERMITTED BY LAW.
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="text">
                                IF DISSATISFIED WITH THE SERVICE, YOUR SOLE REMEDY IS TO DISCONTINUE USE. LUXE HOME HEALTH’S MAXIMUM LIABILITY FOR DIRECT DAMAGES IS LIMITED TO THE LESSER OF (I) AMOUNTS PAID TO US IN THE PRIOR SIX MONTHS OR (II) $50.00.
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="h5" component="h3" color="#7b6e4b" gutterBottom>
                                <MedicalServices sx={{ verticalAlign: 'middle', mr: 1 }} />
                                No Medical Professional Advice
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="text">
                                The Service provides general information only, not tailored to your circumstances. Luxe Home Health limits SMS content to generic Heart Health instructions from physicians. We do not endorse or recommend specific medical procedures, tests or products. The content is not a substitute for professional medical advice, diagnosis or treatment. Always follow your physician’s instructions and consult them for medical questions. Luxe Home Health is an SMS service only, not a healthcare provider. Never disregard professional advice due to information from the Service.
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="h5" component="h3" color="#7b6e4b" gutterBottom>
                                <Balance sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Resolution of Disputes
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="text">
                                <strong>Disputes.</strong> Before filing a claim, contact us at info@luxehh.com to resolve issues informally. If unresolved within 30 days, claims go to binding arbitration per American Arbitration Association rules, except as noted below or if you opt out.
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="text" text>
                                <strong>Opt-Out.</strong> You may opt out of arbitration by contacting Luxe Home Health within 30 days, of accepting these terms. Write to us at Luxe Home Health. If you opt out, neither party can require arbitration.
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="text">
                                <strong>Arbitration Procedures.</strong> Arbitration will follow American Arbitration Association rules, on an individual basis, without consolidation with other claims. Arbitration data is confidential. It’s held in Cook County, IL, or another agreed location. Each party pays their own attorney’s fees.
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="text">
                                <strong>Exceptions.</strong> Claims qualifying for small claims court in Cook County, IL, or lawsuits for injunctive relief for unauthorized Service use or IP infringement may bypass arbitration.
                            </Typography>
                            <Typography text variant="body1" textAlign={'justify'} color="text">
                                <strong>Judicial Forum.</strong> If arbitration is not applicable, disputes proceed in Cook County, IL courts, federal or state courts. You consent to this jurisdiction.
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="h5" component="h3" color="#7b6e4b" gutterBottom>
                                <Description sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Miscellaneous
                            </Typography>
                            <Typography variant="body1" textAlign={'justify'} color="text">
                                <p>If any provision of these Terms is invalid, it’s severable without affecting other terms. These Terms are governed by Illinois law, adjusted for conflicts if needed. No waiver of any breach is a waiver of future breaches. </p>
                                <p>Contact us at: <a href="mailto:info@luxehh.com">info@luxehh.com</a> for more information.</p>
                            </Typography>
                        </Box>

                    </section>
                </Paper>
            </Container>
        </Box>
    );
};

export default TermsAndConditions;