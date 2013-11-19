#!/bin/bash
#-*- utf-8 -*-

#Date       : 11/19/2013
#Desc       : a script to install node.js for ubuntu

echo "It is installing node... "
sudo apt-get install python-software-properties python g++ make
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs