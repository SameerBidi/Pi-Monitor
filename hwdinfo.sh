#!/bin/bash

cpucount=$(nproc)
printf '%s' "$cpucount"
for ((i=0; i<$(nproc);i++))
do
 printf ':%s' "$(cat /sys/devices/system/cpu/cpu$i/cpufreq/cpuinfo_cur_freq)"
 selcpu=$(top -1 -n 1|grep "%Cpu$i")
 cputrim=$(printf '%s' "${selcpu/*":"}")
 printf '_%s'"${cputrim/"us"*}"
done

printf ':%s' "$(echo `cat /sys/class/thermal/thermal_zone0/temp` / 1000.0 | bc)"

printf ':%s' "$(/opt/vc/bin/vcgencmd measure_temp | cut -d = -f2)"

mem=$(free -m | awk 'NR==2{printf "%.2f%%\t\t", $3*100/$2 }')
disk=$(df -h | awk '$NF=="/"{printf "%s\t\t", $5}')
printf ':%s' "$mem"
printf ':%s' "$disk"
