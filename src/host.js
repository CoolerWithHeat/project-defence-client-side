function getHost(withProtocol = true) {

    if (withProtocol) {
        return 'https://mansurdev.store';
    } 
    else {
        return 'wss://mansurdev.store';
    }
}

export default getHost;