import dev from './env-dev'
import pro from './env-pro'

export default () => {
    const NODE_ENV = process.env.NODE_ENV
    switch (NODE_ENV) {
        case "development":
            return dev
        default:
            return pro
    }
}