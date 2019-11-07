const env = process.env.NODE_ENV || 'dev';

const config = () => {
    switch (env){
        case 'dev': 
            return {
                bd_string: 'mongodb+srv://usuario_admin:egito001@clusterapi-hto5v.mongodb.net/test?retryWrites=true&w=majority',
                jwt_password: 'senhatokengabriel',
                jwt_expires: '1d'
            }
            
        case 'hml':
            return {
                bd_string: 'mongodb+srv://usuario_admin:egito001@clusterapi-hto5v.mongodb.net/test?retryWrites=true&w=majority',
                jwt_password: 'aquiasenhadehomologacao',
                jwt_expires: '1d'
            }
            
        case 'prod': {
            return {
                bd_string: 'mongodb+srv://usuario_admin:egito001@clusterapi-hto5v.mongodb.net/test?retryWrites=true&w=majority',
                jwt_password: 'aquiasenhadeproducao',
                jwt_expires: '1d'
            }
        }
    }
};

console.log(`Iniciando a API em ambiente ${env.toUpperCase()}`);

module.exports = config();