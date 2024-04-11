import sys
import frida
import psutil

PROCESS_NAME = "QQ.exe"
# qq
QQ_PID = None
# GUI -> ['C:\\Program Files (x86)\\Tencent\\QQ\\Bin\\QQ.exe']
# 要hook的 -> ['C:\\Program Files (x86)\\Tencent\\QQ\\Bin\\QQ.exe', '/hosthwnd=2164594', '/hostname=QQ_IPC_{12345678-ABCD-12EF-9976-18373DEAB821}', '/memoryid=0', 'C:\\Program Files (x86)\\Tencent\\QQ\\Bin\\QQ.exe']

process_list = []
for pid in psutil.pids():
    p = psutil.Process(pid)
    # QQ.exe and len(p.cmdline()) > 1
    # and len(p.cmdline()) == 1
    if p.name() == PROCESS_NAME :
        print(p.cmdline())
        process_list.append(p)
        del p
        break

print("QQ pids count:", len(process_list))
if len(process_list) == 1:
    QQ_PID = process_list[0].pid

if QQ_PID is None:
    print("QQ not launched. exit.")
    sys.exit(1)
print("QQ pid is:", QQ_PID)

# jscode = '''
# Java.perform(function() {
#     var CoolMarket = Java.use('com.coolapk.market.CoolMarketApplication');
#     CoolMarket.onLog.implementation = function() {
        
#         var deviceId = Java.use('com.coolapk.market.util.SystemUtils').getDeviceId(this);
#         console.log('Device Id: ', deviceId);

#         var app_token = Java.use('com.coolapk.market.util.AuthUtils').getAS(this, deviceId);
#         console.log('App Token: ', app_token);

#         console.log('----------');
#         return 1;
#     }
# })
# '''


jscodes = '''
Java.perform(function() {
    var load_pointer = Module.getExportByName('libnative-lib.so', 'JNI_OnLoad');
    var hook_pointer = '0x' + parseInt(parseInt(load_pointer) - parseInt('0x31A04') + parseInt('0x31DB8')).toString(16);
    var pointer = new NativePointer(hook_pointer);
    console.log('Hook Method Pointer: ', pointer);

    var b64_encode = new NativeFunction(pointer, 'pointer', ['uchar', 'uint']);

    Interceptor.attach(pointer, {
        onEnter: function(args) {
            console.log('===> method hooked.');
            console.log(Memory.readCString(args[0]));
            console.log(args[1].toInt32());
            console.log('---');
        },
        onLeave: function(retval) {
            console.log(Memory.readCString(retval));
        }
    });
})
'''

def on_message(message, data):
    print("[%s] => %s" % (message, data))

def on_destroyed():
    print("process exited.")
    sys.exit(0)

if __name__ == '__main__':
    jscode = open('_agent.js', 'r',encoding='utf-8').read()
    print("attach")
    process = frida.attach(QQ_PID)
    script = process.create_script(jscode)
    script.on('message', on_message)
    script.on('destroyed', on_destroyed)
    print('[*] Running CTF')
    script.load()
    sys.stdin.readline()
    # print('api.hello() =>', script.exports.hello())
    process.detach()