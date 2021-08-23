---
layout: article
title: 串口通信
tags: [SerialPort, 串口]
show_subscribe: false
cover: assets/images/windows.png
---

使用C++/C在Windows上进行串口通信的方法。

<!--more-->

在Windows上用C++/C读取串口数据是件麻烦的事情，因为官方库中并没有提供直接读取串口的函数，只能去根据Windows API文档，调用相关的Win32 API去读写串口。

---

## 打开串口

在Windows中，对I/O设备的操作被抽象为对文件进行操作，因此打开串口需要用到函数`CreateFile`。`CreateFile`在windows.h中有通过宏定义为`CreateFileA`和`CreateFileW`，编译器会自行根据编码格式决定所要使用的函数。

```cpp
void SerialPort::open(const char* portName)
{
  hCom = CreateFile(portName,
    GENERIC_READ | GENERIC_WRITE,
  0,    // exclusive access 
  NULL, // default security attributes 
  OPEN_EXISTING,
  FILE_ATTRIBUTE_NORMAL,
  NULL
 );

 if (!GetCommState(hCom, &dcbSerialParameters))
 {
  printf("Failed to get current serial parameters\n");
 }
 else
 {
  dcbSerialParameters.BaudRate = CBR_115200;
  dcbSerialParameters.ByteSize = 8;
  dcbSerialParameters.StopBits = ONESTOPBIT;
  dcbSerialParameters.Parity = NOPARITY;
  dcbSerialParameters.fDtrControl = DTR_CONTROL_DISABLE;

  if (!SetCommState(hCom, &dcbSerialParameters))
  {
   printf("Could not set serial port parameters\n");
  }
  else
  {

   PurgeComm(hCom, PURGE_RXCLEAR | PURGE_TXCLEAR);
   Sleep(100);
  }
 }

 if (!SetCommMask(hCom, EV_RXCHAR))
 {
  return;
 }
}
```

<!-- [![Star This Project](https://img.shields.io/github/stars/kitian616/jekyll-TeXt-theme.svg?label=Stars&style=social)](https://github.com/kitian616/jekyll-TeXt-theme/) -->
