// import LangSelect from '@/components/LangSelect';
import {Message} from 'element-ui';
import {Base64} from 'js-base64';
import http from '../../utils/http';

export default {
    name: 'login',
    // components: {
    //     LangSelect
    // },
    data() {
        return {
            imageUrl: '/public/checkCode',
            lang: this.$store.state.app.language,
            login: {
                passport: '',
                password: '',
                checkcode: ''
            },
            rules: {
                passport: [
                    {
                        required: true,
                        message: '用户名为空！', /* this.$t('login.valid.userexist'), */
                        trigger: 'change'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '密码为空！', /* this.$t('login.valid.pwdexist'), */
                        trigger: 'change'
                    }
                ],
                checkcode: [{
                    required: true,
                    message: '验证码输入错误！', /* this.$t('login.valid.checkcodeError'), */
                    trigger: 'change'
                }, {
                    min: 4,
                    max: 4,
                    message: '验证码输入错误！', /* this.$t('login.valid.checkcodeError'), */
                    trigger: 'change'}
                ]
            },
            remember: false
        }
    },
    created() {
        let passport = this.getCookie('passport');
        let password = Base64.decode(this.getCookie('password'));
        if (passport) {
            this.login.passport = passport;
            this.login.password = password;
            this.remember = true;
        } else {
            this.remember = false;
        }
    },
    mounted() {
        document.title = this.$project.name;
        let link = document.querySelector('link[rel*="icon"]') || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = this.logo;
        document.getElementsByTagName('head')[0].appendChild(link);
    },
    methods: {
        /**
         * 变换验证码
         */
        handleCode: function() {
            let rand = Math.floor(Math.random() * (1000 + 1));
            this.imageUrl = '/public/checkCode?' + rand;
        },
        handleLogin() {
            this.$refs['form'].validate(async valid => {
                if (valid) {
                    http.post('/public/login', this.login, false, false).then(res => {
                        if (res && res.code === 1) {
                            sessionStorage.setItem('name', res.data.name || '');
                            if (this.remember) {
                                this.setCookie('passport', this.login.passport, 7);
                                let passWord = Base64.encode(this.login.password);
                                this.setCookie('password', passWord, 7);
                            } else {
                                this.setCookie('passport', '');
                                this.setCookie('password', '');
                            }
                            this.$router.push('/');
                        } else {
                            this.handleCode();
                        }
                    }).catch(res => {
                        this.handleCode();
                        Message.error(res.message);
                    })
                } else {
                    // Message.error(this.$t('login.validfaild'))
                    Message.error('数据输入不完整,请检查后重新输入。');
                }
            })
        },
        // 获取cookie
        getCookie: function (key) {
            if (document.cookie.length > 0) {
                let start = document.cookie.indexOf(key + '=');
                if (start !== -1) {
                    start = start + key.length + 1;
                    let end = document.cookie.indexOf(';', start);
                    if (end === -1) {
                        end = document.cookie.length;
                    }
                    return unescape(document.cookie.substring(start, end));
                }
            }
            return '';
        },
        // 保存cookie
        setCookie: function (cName, value, expiredays) {
            let exdate = new Date();
            exdate.setDate(exdate.getDate() + expiredays);
            document.cookie = cName + '=' + decodeURIComponent(value) + (expiredays == null ? '' : ';expires=' + exdate.toGMTString());
        }
    }
}
