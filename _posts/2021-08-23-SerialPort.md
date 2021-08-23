---
layout: article
title: 串口通信 - 同步模式
tags: [SerialPort, 串口]
show_subscribe: false
cover: assets/images/windows.png
key: page-serial-port-sync
---

使用C++/C在Windows上进行串口通信的方法。

<!--more-->

在Windows上用C++/C读取串口数据是件麻烦的事情，因为官方库中并没有提供直接读取串口的函数，只能根据Windows API文档，调用相关的Win32 API去读写串口。

---

## 串口类的创建

为了更好的抽象串口通信，我写了个一个串口类，集成了打开、读取、写入等串口通信功能。类的定义如下：

```cpp
#pragma once

#include <iostream>
#include <Windows.h>

// TODO: 在此处引用程序需要的其他标头。

class SerialPort
{
public:
 explicit SerialPort();
 //~SerialPort();
 void open(const char *portname);
 void searchAvailablePort();
 bool read(const char* buffer, unsigned int buf_size);
 bool write(const char* buffer, unsigned int buf_size);

private:
 HANDLE hCom;
 DWORD dwCommEvent;
 DWORD dwRead;
 OVERLAPPED o;
 COMSTAT status;
 DWORD errors;
 DCB dcbSerialParameters = { 0 };
};
```

## 打开串口

在Windows中，对I/O设备的操作被抽象为对文件进行操作，因此打开串口需要用到函数`CreateFile`。
`CreateFile`在windows.h中被宏定义分为`CreateFileA`和`CreateFileW`，编译器会自行根据编码格式决定所要使用的函数。

`CreateFile`的第一个参数为叫做lpFileName，在串口通新中就是串口号，例如`COM3`。由于编译器会自行选用合适的函数，调用函数时可以直接将`COM3`字符串作为参数传入。

当串口打开后，函数会返回一个HANDLE句柄，但此时还不能直接读写串口，需要先设置DCB结构参数。

```cpp
void SerialPort::open(const char* portName)
{
  hCom = CreateFile(portName,
    GENERIC_READ | GENERIC_WRITE,
  0,    // exclusive access 
  NULL, // default security attributes 
  OPEN_EXISTING,
  FILE_ATTRIBUTE_NORMAL, // 同步模式
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
